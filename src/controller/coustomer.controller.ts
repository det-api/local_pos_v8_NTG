import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  addCoustomer,
  deleteCoustomer,
  getCoustomer,
  searchCoustomer,
} from "../service/coustomer.service";

export const getCoustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getCoustomer(req.query);
    fMsg(res, "Coustomer are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addCoustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addCoustomer(req.body);
    fMsg(res, "New Coustomer was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletCoustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteCoustomer(req.query);
    fMsg(res, "Coustomer was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const searchCoustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await searchCoustomer(req.query);
    fMsg(res, "search result", result);
  } catch (e) {
    next(new Error(e));
  }
};
