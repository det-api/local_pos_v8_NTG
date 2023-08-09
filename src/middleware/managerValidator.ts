import { NextFunction, Response, Request } from "express";
import { compass } from "../utils/helper";
import UserModel from "../model/user.model";

//if you want to access multi role change this like hasAnyRole

export const managerValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user = await UserModel.find({ email: req.body.email });

    let condition = compass(req.body.password, user[0].password);

    if (!user[0] || !condition) {
      throw new Error("Creditial Error");
    }
    delete req.body.email;
    delete req.body.password;
    next();
  } catch (e) {
    next(new Error(e));
  }
};
