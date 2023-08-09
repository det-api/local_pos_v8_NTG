import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  addInitialSetup,
  deleteInitialSetup,
  getInitialSetup,
  initialSetupCount,
  updateInitialSetup,
} from "../service/initialSetup.service";
import { deleteDevice, getDeviceCount } from "../service/device.service";
import {
  deleteFuelBalance,
  getFuelBalanceCount,
} from "../service/fuelBalance.service";

export const getInitialSetupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getInitialSetup(req.query);

    let nzCount = await getDeviceCount();
    let tkCount = await getFuelBalanceCount();

    if (result[0]?.nozzleCount <= nzCount && result[0]?.tankCount <= tkCount) {
      result = await updateInitialSetup(
        { _id: result[0]._id },
        { conditon: true }
      );
    }

    fMsg(
      res,
      "InitialSetup are here",
      result.length == 0
        ? { condition: false }
        : { condition: result[0].condition }
    );
  } catch (e) {
    next(new Error(e));
  }
};

export const addInitialSetupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let nzCount = await getDeviceCount();
    let tkCount = await getFuelBalanceCount();
    let iniCount = await initialSetupCount();
    if (nzCount || tkCount || iniCount) {
      await deleteInitialSetup({});
      await deleteDevice({});
      await deleteFuelBalance({});
    }

    let result = await addInitialSetup(req.body);

    fMsg(res, "New InitialSetup was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletInitialSetupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteInitialSetup(req.query);
    fMsg(res, "InitialSetup was deleted");
  } catch (e) {
    next(new Error(e));
  }
};
