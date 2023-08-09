import { Request, Response, NextFunction } from "express";
import { connectingFunction } from "../connection/device.connection";
import fMsg, { mqttEmitter } from "../utils/helper";
import { sub_topic } from "../utils/connect";
import { calcFuelBalance } from "../service/fuelBalance.service";

export const connectDeviceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await connectingFunction();
    fMsg(res, "Connection Finish", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const devicePermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let depNo = req.query.depNo?.toString();
    let nozzleNo = req.query.nozzleNo?.toString();
    if (!depNo || !nozzleNo) {
      throw new Error("you need pumpNo or message");
    }

    mqttEmitter(sub_topic + depNo, nozzleNo + "appro");

    fMsg(res, "all is well");
  } catch (e) {
    next(new Error(e));
  }
};


// export const updateByDeviceHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {

//   console.log(req.query)

//   console.log(req.body),

//   calcFuelBalance({} , {} , '')

// }
