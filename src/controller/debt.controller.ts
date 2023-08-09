import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  DebtPaginate,
  addDebt,
  countDebt,
  deleteDebt,
  detailSaleByDateAndPagi,
  getDebt,
  updateDebt,
} from "../service/debt.service";
import {
  getCoustomerById,
  updateCoustomer,
} from "../service/coustomer.service";
import moment from "moment-timezone";
import { debtDocument } from "../model/debt.model";
import axios from "axios";
import config from "config";

export const getDebtHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);

    let { data, count } = await DebtPaginate(pageNo, req.query);
    fMsg(res, "Debt are here", data, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const addDebtHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cuurentDateForVocono = moment().tz("Asia/Yangon").format("DDMMYYYY");
    const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

    if (!req.body.couObjId) throw new Error("you need customer id");

    let coustomerConditon = await getCoustomerById(req.body.couObjId);

    if (!coustomerConditon)
      throw new Error("There is no coustomer with that name");

    let url = config.get<string>("debtCloudUrl");
    let response = await axios.post(url, req.body);

    if (response.status != 200) {
      throw new Error(response.data.msg);
    }

    if (req.body.deposit) {
      let count = await countDebt({ dateOfDay: currentDate });
      req.body.vocono = `paid/${cuurentDateForVocono}/${count}`;
      req.body.paided = true;

      let result = await addDebt(req.body);

      let newUpdateDebt = await getDebt({
        couObjId: coustomerConditon._id,
        paided: false,
      });

      paidedHandler(newUpdateDebt, result.deposit);

      coustomerConditon.cou_debt = coustomerConditon.cou_debt - result.deposit;

      await updateCoustomer(result.couObjId, coustomerConditon);

      fMsg(res, "New Debt data was added", result);
    }

    if (req.body.credit) {
      if (!req.body.vocono) throw new Error("You need to add vocono ");

      let approvVocono = await getDebt({ vocono: req.body.vocono });

      if (!approvVocono) throw new Error("There is no vocono with that number");

      let debtBody = {
        stationDetailId: approvVocono[0].stationDetailId,
        vocono: req.body.vocono,
        couObjId: approvVocono[0].couObjId,
        deposit: 0,
        credit: approvVocono[0].credit,
        liter: approvVocono[0].liter,
      };

      coustomerConditon.cou_debt =
        coustomerConditon.cou_debt + approvVocono[0].credit;

      let addResutl = await addDebt(debtBody);

      await updateCoustomer(req.body.couObjId, coustomerConditon);

      fMsg(res, "New Debt data was added", addResutl);
    }
    // throw new Error("you need customer id or deposit");
  } catch (e) {
    next(new Error(e));
  }
};

export const updateDebtHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateDebt(req.query, req.body);
    fMsg(res, "updated Debt data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteDebtHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteDebt(req.query);
    fMsg(res, "Debt data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const getDebtDatePagiHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;
    let pageNo: number = Number(req.params.page);

    delete req.query.sDate;
    delete req.query.eDate;

    let query = req.query;

    if (!sDate) {
      throw new Error("you need date");
    }
    if (!eDate) {
      eDate = new Date();
    }
    //if date error ? you should use split with T or be sure detail Id
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);
    let { data, count } = await detailSaleByDateAndPagi(
      query,
      startDate,
      endDate,
      pageNo
    );

    fMsg(res, "debt between two date", data, count);
  } catch (e) {
    next(new Error(e));
  }
};

let paidedHandler = async (arr: debtDocument[], limitAmount: number) => {
  let cacualatedCredit = 0;

  for (const ea of arr) {
    cacualatedCredit += ea.credit;

    if (cacualatedCredit <= limitAmount) {
      ea.paided = true;
      await updateDebt({ _id: ea._id }, { paided: ea.paided });
    } else {
      break;
    }
  }
};
