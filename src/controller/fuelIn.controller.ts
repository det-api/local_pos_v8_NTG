import { Request, Response, NextFunction, query } from "express";
import fMsg from "../utils/helper";
import {
  getFuelIn,
  addFuelIn,
  updateFuelIn,
  deleteFuelIn,
  fuelInPaginate,
  fuelInByDate,
} from "../service/fuelIn.service";

export const getFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);
    let { data, count } = await fuelInPaginate(pageNo, req.query);
    fMsg(res, "FuelIn are here", data, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const addFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addFuelIn(req.body);
    fMsg(res, "New FuelIn data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateFuelIn(req.query, req.body);
    fMsg(res, "updated FuelIn data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteFuelInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteFuelIn(req.query);
    fMsg(res, "FuelIn data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const getFuelInByDateHandler = async (
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

    let { data, count } = await fuelInByDate(query, startDate, endDate, pageNo);
    fMsg(res, "fuel balance between two date", data, count);
  } catch (e) {
    next(new Error(e));
  }
};
