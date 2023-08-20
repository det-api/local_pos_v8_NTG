import { FilterQuery, UpdateQuery } from "mongoose";
import detailSaleModel, { detailSaleDocument } from "../model/detailSale.model";
import config from "config";
import { UserDocument } from "../model/user.model";
import moment from "moment-timezone";
import { mqttEmitter, previous } from "../utils/helper";
import axios from "axios";
import {
  getCoustomer,
  getCoustomerById,
  updateCoustomer,
} from "./coustomer.service";
import { deviceLiveData } from "../connection/liveTimeData";
import {
  addFuelBalance,
  calcFuelBalance,
  getFuelBalance,
} from "./fuelBalance.service";
import { addDailyReport, getDailyReport } from "./dailyReport.service";
import { fuelBalanceDocument } from "../model/fuelBalance.model";
import { updateDevice } from "./device.service";

interface Data {
  nozzleNo: string;
  fuelType: string;
  vocono: string;
  casherCode: string;
  asyncAlready: string;
  stationDetailId: string;
  cashType: string;
  couObjId: string;
  totalizer_liter: number | undefined;
  totalizer_amount: number | undefined;
  createAt: Date;
  user: UserDocument[];
}

const limitNo = config.get<number>("page_limit");

export const getDetailSale = async (query: FilterQuery<detailSaleDocument>) => {
  try {
    return await detailSaleModel.find(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const preSetDetailSale = async (
  depNo: string,
  nozzleNo: string,
  preset: string,
  type: string,
  body
) => {
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
  const cuurentDateForVocono = moment().tz("Asia/Yangon").format("DDMMYYYY");

  const options = { timeZone: "Asia/Yangon", hour12: false };

  let currentDateTime = new Date().toLocaleTimeString("en-US", options);

  const [hour, minute, second] = currentDateTime.split(":").map(Number);

  if (hour == 24) {
    currentDateTime = `00:${minute}:${second}`;
  }

  let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);

  const count = await detailSaleModel.countDocuments({
    dailyReportDate: currentDate,
  });

  const lastDocument = await detailSaleModel
    .findOne({ nozzleNo: body.nozzleNo })
    .sort({ _id: -1, createAt: -1 });

  body = {
    ...body,
    vocono: `${body.user[0].stationNo}/${
      body.user[0].name
    }/${cuurentDateForVocono}/${count + 1}`,
    stationDetailId: body.user[0].stationId,
    casherCode: body.user[0].name,
    asyncAlready: "0",
    totalizer_liter: lastDocument?.totalizer_liter,
    totalizer_amount: lastDocument?.totalizer_amount,
    preset: `${preset} ${type}`,
    createAt: iso,
  };

  // const lastDocument = await detailSaleModel
  //   .findOne({ nozzleNo: body.nozzleNo })
  //   .sort({ _id: -1, createAt: -1 });

  // if (
  //   lastDocument?.saleLiter == 0 ||
  //   lastDocument?.vehicleType == null ||
  //   lastDocument?.totalPrice == 0
  // ) {
  //   throw new Error(`${lastDocument?.vocono}`);
  // }

  // if (
  //   lastDocument?.saleLiter == 0 &&
  //   lastDocument?.asyncAlready == "0"
  // ) {
  //   // throw new Error(`${lastDocument?.vocono}`);
  //   await detailSaleModel.findByIdAndDelete(lastDocument?._id);
  // }

  let result = await new detailSaleModel(body).save();

  let checkDate = await getFuelBalance({
    stationId: result.stationDetailId,
    createAt: result.dailyReportDate,
  });

  let checkRpDate = await getDailyReport({
    stationId: result.stationDetailId,
    dateOfDay: result.dailyReportDate,
  });

  if (checkRpDate.length == 0) {
    await addDailyReport({
      stationId: result.stationDetailId,
      dateOfDay: result.dailyReportDate,
    });
  }

  if (checkDate.length == 0) {
    let prevDate = previous(new Date(result.dailyReportDate));

    let prevResult = await getFuelBalance({
      stationId: result.stationDetailId,
      createAt: prevDate,
    });

    await Promise.all(
      prevResult.map(async (ea) => {
        let obj: fuelBalanceDocument;
        if (ea.balance == 0) {
          obj = {
            stationId: ea.stationId,
            fuelType: ea.fuelType,
            capacity: ea.capacity,
            opening: ea.opening + ea.fuelIn,
            tankNo: ea.tankNo,
            createAt: result?.dailyReportDate,
            nozzles: ea.nozzles,
            balance: ea.opening + ea.fuelIn,
          } as fuelBalanceDocument;
        } else {
          obj = {
            stationId: ea.stationId,
            fuelType: ea.fuelType,
            capacity: ea.capacity,
            opening: ea.opening + ea.fuelIn - ea.cash,
            tankNo: ea.tankNo,
            createAt: result?.dailyReportDate,
            nozzles: ea.nozzles,
            balance: ea.opening + ea.fuelIn - ea.cash,
          } as fuelBalanceDocument;
        }

        await addFuelBalance(obj);
      })
    );
  }

  mqttEmitter(`detpos/local_server/preset`, nozzleNo + type + preset);
  return result;
};

export const addDetailSale = async (
  depNo: string,
  nozzleNo: string,
  body: Data
) => {
  try {
    const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
    const cuurentDateForVocono = moment().tz("Asia/Yangon").format("DDMMYYYY");

    const options = { timeZone: "Asia/Yangon", hour12: false };

    let currentDateTime = new Date().toLocaleTimeString("en-US", options);

    const [hour, minute, second] = currentDateTime.split(":").map(Number);

    if (hour == 24) {
      currentDateTime = `00:${minute}:${second}`;
    }

    let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);

    const count = await detailSaleModel.countDocuments({
      dailyReportDate: currentDate,
    });

    const lastDocument = await detailSaleModel
      .findOne({ nozzleNo: body.nozzleNo })
      .sort({ _id: -1, createAt: -1 });

    body = {
      ...body,
      vocono: `${body.user[0].stationNo}/${
        body.user[0].name
      }/${cuurentDateForVocono}/${count + 1}`,
      stationDetailId: body.user[0].stationId,
      casherCode: body.user[0].name,
      asyncAlready: "0",
      totalizer_liter: lastDocument?.totalizer_liter,
      totalizer_amount: lastDocument?.totalizer_amount,
      createAt: iso,
    };

    let result = await new detailSaleModel(body).save();

    let checkDate = await getFuelBalance({
      stationId: result.stationDetailId,
      createAt: result.dailyReportDate,
    });

    let checkRpDate = await getDailyReport({
      stationId: result.stationDetailId,
      dateOfDay: result.dailyReportDate,
    });

    if (checkRpDate.length == 0) {
      await addDailyReport({
        stationId: result.stationDetailId,
        dateOfDay: result.dailyReportDate,
      });
    }
    if (checkDate.length == 0) {
      let prevDate = previous(new Date(result.dailyReportDate));

      let prevResult = await getFuelBalance({
        stationId: result.stationDetailId,
        createAt: prevDate,
      });

      await Promise.all(
        prevResult.map(async (ea) => {
          let obj: fuelBalanceDocument;
          if (ea.balance == 0) {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn,
              tankNo: ea.tankNo,
              createAt: result?.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn,
            } as fuelBalanceDocument;
          } else {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn - ea.cash,
              tankNo: ea.tankNo,
              createAt: result?.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn - ea.cash,
            } as fuelBalanceDocument;
          }

          await addFuelBalance(obj);
        })
      );
    }

    mqttEmitter(`detpos/local_server/${depNo}`, nozzleNo + "appro");

    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  body: UpdateQuery<detailSaleDocument>
) => {
  try {
    let data = await detailSaleModel.findOne(query);
    if (!data) throw new Error("no data with that id");

    await detailSaleModel.updateMany(query, body);

    return await detailSaleModel.findById(data._id).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const detailSaleUpdateError = async (
  query: FilterQuery<detailSaleDocument>,
  body: UpdateQuery<detailSaleDocument>
) => {
  try {
    let data = await detailSaleModel.findOne(query);
    if (!data) throw new Error("no data with that id");

    const lastData: any = await detailSaleModel
      .find({ nozzleNo: data.nozzleNo })
      .sort({ _id: -1, createAt: -1 })
      .limit(2);

    body = {
      ...body,
      asyncAlready: "1",
      totalizer_liter: lastData[1].totalizer_liter + Number(body.saleLiter),
      totalizer_amount: lastData[1].totalizer_amount + Number(body.totalPrice),
      isError: true,
    };

    let updateData = await detailSaleModel.findOneAndUpdate(query, body);

    let result = await detailSaleModel.findOne({ _id: updateData?._id });

    if (!result) {
      throw new Error("Final send in error");
    }

    mqttEmitter("detpos/local_server", `${result?.nozzleNo}/D1S1`);

    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const detailSaleUpdateByDevice = async (topic: string, message) => {
  try {
    const regex = /[A-Z]/g;
    let data: any[] = message.split(regex);
    // console.log("wk");
    // let [saleLiter, totalPrice] = deviceLiveData.get(data[0]);
    let saleLiter = deviceLiveData.get(data[0])?.[0];
    let totalPrice = deviceLiveData.get(data[0])?.[1];

    let query = {
      nozzleNo: data[0],
    };

    const lastData: any[] = await detailSaleModel
      .find(query)
      .sort({ _id: -1, createAt: -1 })
      .limit(2)
      .lean();

    if (!lastData[0] || !lastData[1]) {
      return;
    }

    // if (
    //   saleLiter == 0 ||
    //   (saleLiter == null && data[2] == 0) ||
    //   data[2] == ""
    // ) {
    //   await detailSaleModel.findByIdAndDelete(lastData[0]?._id);
    //   mqttEmitter("detpos/local_server", `${lastData[0]?.nozzleNo}/D1S1`);
    //   return;
    // }

    let updateBody: UpdateQuery<detailSaleDocument> = {
      nozzleNo: data[0],
      salePrice: data[1],
      saleLiter: saleLiter,
      totalPrice: totalPrice,
      asyncAlready: "1",
      totalizer_liter:
        lastData[1].totalizer_liter + Number(saleLiter ? saleLiter : 0),
      totalizer_amount:
        lastData[1].totalizer_amount + Number(totalPrice ? totalPrice : 0),
    };

    await detailSaleModel.findByIdAndUpdate(lastData[0]._id, updateBody);

    let result = await detailSaleModel.findById(lastData[0]._id);

    if (!result) {
      throw new Error("Final send in error");
    }

    // cloud and balance calculation
    let checkDate = await getFuelBalance({
      stationId: result.stationDetailId,
      createAt: result.dailyReportDate,
    });
    let checkRpDate = await getDailyReport({
      stationId: result.stationDetailId,
      dateOfDay: result.dailyReportDate,
    });
    if (checkRpDate.length == 0) {
      await addDailyReport({
        stationId: result.stationDetailId,
        dateOfDay: result.dailyReportDate,
      });
    }
    // create the data in fuel balance db data with today date is not exist in db
    if (checkDate.length == 0) {
      let prevDate = previous(new Date(result.dailyReportDate));

      let prevResult = await getFuelBalance({
        stationId: result.stationDetailId,
        createAt: prevDate,
      });
      await Promise.all(
        prevResult.map(async (ea) => {
          let obj: fuelBalanceDocument;
          if (ea.balance == 0) {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn,
              tankNo: ea.tankNo,
              createAt: result?.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn,
            } as fuelBalanceDocument;
          } else {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn - ea.cash,
              tankNo: ea.tankNo,
              createAt: result?.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn - ea.cash,
            } as fuelBalanceDocument;
          }

          await addFuelBalance(obj);
        })
      );
    }
    mqttEmitter("detpos/local_server", `${result?.nozzleNo}/D1S1`);

    await calcFuelBalance(
      {
        stationId: result.stationDetailId,
        fuelType: result.fuelType,
        createAt: result.dailyReportDate,
      },
      { liter: result.saleLiter },
      result.nozzleNo
    );

    let prevDate = previous(new Date(result.dailyReportDate));

    let checkErrorData = await detailSaleModel.find({
      asyncAlready: 0,
      dailyReportDate: prevDate,
    });
    if (checkErrorData.length > 0) {
      console.log("error 0 in prev date");
      for (const ea of checkErrorData) {
        try {
          let url = config.get<string>("detailsaleCloudUrl");
          let response = await axios.post(url, ea);
          if (response.status == 200) {
            await detailSaleModel.findByIdAndUpdate(ea._id, {
              asyncAlready: "2",
            });
          } else {
            break;
          }
        } catch (error) {
          if (error.response && error.response.status === 409) {
          } else {
          }
        }
      }
    }
    let finalData = await detailSaleModel.find({ asyncAlready: 1 });
    for (const ea of finalData) {
      try {
        let url = config.get<string>("detailsaleCloudUrl");
        let response = await axios.post(url, ea);
        if (response.status == 200) {
          await detailSaleModel.findByIdAndUpdate(ea._id, {
            asyncAlready: "2",
          });
        } else {
          break;
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
        } else {
        }
      }
    }
    // mqttEmitter("detpos/local_server", `${result?.nozzleNo}/D1S1`);
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDetailSale = async (
  query: FilterQuery<detailSaleDocument>
) => {
  try {
    let DetailSale = await detailSaleModel.find(query);
    if (!DetailSale) {
      throw new Error("No DetailSale with that id");
    }
    return await detailSaleModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDetailSaleByFuelType = async (
  dateOfDay: string,
  // stationId : string,
  fuelType: string
) => {
  let fuel = await getDetailSale({
    dailyReportDate: dateOfDay,
    fuelType: fuelType,
  });

  let fuelLiter = fuel
    .map((ea) => ea["saleLiter"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);
  let fuelAmount = fuel
    .map((ea) => ea["totalPrice"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);

  return { count: fuel.length, liter: fuelLiter, price: fuelAmount };
};

export const detailSalePaginate = async (
  pageNo: number,
  query: FilterQuery<detailSaleDocument>
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  const data = await detailSaleModel
    .find(query)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .select("-__v");
  const count = await detailSaleModel.countDocuments(query);

  return { data, count };
};

export const detailSaleByDate = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date
): Promise<detailSaleDocument[]> => {
  const filter: FilterQuery<detailSaleDocument> = {
    ...query,
    createAt: {
      $gt: d1,
      $lt: d2,
    },
  };

  let result = await detailSaleModel
    .find(filter)
    .sort({ createAt: -1 })
    // .populate("stationDetailId")
    .select("-__v");

  return result;
};

export const detailSaleByDateAndPagi = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date,
  pageNo: number
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  try {
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter: FilterQuery<detailSaleDocument> = {
      ...query,
      createAt: {
        $gt: d1,
        $lt: d2,
      },
    };

    const dataQuery = detailSaleModel
      .find(filter)
      .sort({ createAt: -1 })
      .skip(skipCount)
      .limit(limitNo)
      // .populate("stationDetailId")
      .select("-__v");

    const countQuery = detailSaleModel.countDocuments(filter);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count };
  } catch (error) {
    console.error("Error in detailSaleByDateAndPagi:", error);
    throw error;
  }
};

export const initialDetail = async (body) => {
  try{
    body.vocono = Date.now()
    console.log(body)
    return await new detailSaleModel(body).save();

  }catch(e) {
    throw e;
  }
};
