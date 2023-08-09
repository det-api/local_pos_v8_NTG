import { NextFunction, Response, Request } from "express";
import { permitDocument } from "../model/permit.model";

export const hasAnyPermit =
  (permits: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try{
      let bol: boolean = false;
    for (let i = 0; i < permits.length; i++) {
      let hasPermit = req.body.user[0].permits.find(
        (ea: permitDocument) => ea.name == permits[i]
      );
      if (hasPermit) {
        bol = true;
        break;
      }
    }
    if (!bol) return next(new Error("You have not that permit"));
    next();
    }catch(e){
    next(new Error(e));
    }
  };
