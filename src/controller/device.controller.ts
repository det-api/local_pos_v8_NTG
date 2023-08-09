import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  addDevice,
  countDevice,
  deleteDevice,
  getDevice,
} from "../service/device.service";

export const getDeviceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getDevice(req.query);

    fMsg(res, "Device are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addDeviceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let noOfCount = await countDevice();
    if (noOfCount == 32) {
      throw new Error("only 32 nozzle can access");
    }
    let result = await addDevice(req.body);
    fMsg(res, "New Device was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletDeviceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteDevice(req.query);
    fMsg(res, "Device was deleted");
  } catch (e) {
    next(new Error(e));
  }
};
