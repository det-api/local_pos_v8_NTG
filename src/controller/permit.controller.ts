import { Request, Response, NextFunction } from "express";
import { getPermit, addPermit, deletePermit } from "../service/permit.service";
import fMsg from "../utils/helper";

export const getPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getPermit(req.query);
    fMsg(res, "Permit are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addPermit(req.body);
    fMsg(res, "New permit was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deletePermit(req.query);
    fMsg(res, "Permit was deleted");
  } catch (e) {
    next(new Error(e));
  }
};
