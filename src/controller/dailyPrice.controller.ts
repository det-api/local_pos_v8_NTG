import { Request, Response, NextFunction } from "express";
import fMsg, { mqttEmitter } from "../utils/helper";
import {
  addDailyPrice,
  dailyPricePaginate,
  deleteDailyPrice,
  updateDailyPrice,
} from "../service/dailyPrice.service";
import { updateDevice } from "../service/device.service";

export const getDailyPriceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);

    let { data, count } = await dailyPricePaginate(pageNo, req.query);
    fMsg(res, "dailyPrice are here", data, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const addDailyPriceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addDailyPrice(req.body);

    let nt = await updateDevice(
      { fuel_type: "001-Octane Ron(92)" },
      { daily_price: result.ninety_two }
    );
    let nf = await updateDevice(
      { fuel_type: "002-Octane Ron(95)" },
      { daily_price: result.ninety_five }
    );
    let hsd = await updateDevice(
      { fuel_type: "004-Diesel" },
      { daily_price: result.HSD }
    );
    let phsd = await updateDevice(
      { fuel_type: "005-Premium Diesel" },
      { daily_price: result.PHSD }
    );
    const newArray = [...nt, ...nf, ...hsd, ...phsd];

    newArray.forEach((ea, index) => {
      // Perform operations on each item
      setTimeout(() => {
        mqttEmitter(
          "detpos/local_server/price",
          `${ea.nozzle_no}${ea.daily_price.toString().padStart(4, "0")}`
        );
      }, 1000 * (index + 1));
    });

    fMsg(res, "New dailyPrice data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateDailyPriceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateDailyPrice(req.query, req.body);
    fMsg(res, "updated dailyPrice data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteDailyPriceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteDailyPrice(req.query);
    fMsg(res, "dailyPrice data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};
