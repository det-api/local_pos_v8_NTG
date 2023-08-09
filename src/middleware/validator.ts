import { NextFunction, Response, Request } from "express";
import { checkToken } from "../utils/helper";
import { getUser } from "../service/user.service";

export const validateAll =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      let result = await schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (e: any) {
      console.log(e);
      return next(new Error(e.errors[0].message));
    }
  };
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("invalid token"));
    }
    let decoded = checkToken(token);
    let user = await getUser({ _id: decoded._id });
    req.body = req.body || {};
    req.body.user = user;
    next();
  } catch (e) {
    next(new Error(e));
  }
};
export const validateToken2 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    console.log("wk");

    if (!token) {
      return next(new Error("invalid token"));
    }
    let decoded = checkToken(token);
    // console.log(decoded);
    req.body = req.body || {};
    req.body.user = [decoded];
    // console.log(req.body.user);
    next();
  } catch (e) {
    next(new Error(e));
  }
};
