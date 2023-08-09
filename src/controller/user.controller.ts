import { Request, Response, NextFunction } from "express";

import fMsg from "../utils/helper";
import { getPermit } from "../service/permit.service";
import { getRole } from "../service/role.service";
import {
  deleteUser,
  getUser,
  loginUser,
  registerUser,
  updateUser,
  userAddPermit,
  userAddRole,
  userRemovePermit,
  userRemoveRole,
} from "../service/user.service";

export const registerUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await registerUser(req.body);
    fMsg(res, "user registered", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const loginUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await loginUser(req.body);
    fMsg(res, "logined users", result);
  } catch (e) {
    next(e);
  }
};

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getUser(req.query);
    fMsg(res, "users are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateUser(req.query, req.body);
    fMsg(res, "updated user data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const getUserByAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getUser(req.query);
    fMsg(res, "registered users", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await deleteUser(req.query);
    fMsg(res, "user deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const userAddRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = await getUser({ _id: req.body.userId });
  let role = await getRole({ _id: req.body.roleId });

  if (!user[0] || !role[0]) {
    return next(new Error("there is no role or user"));
  }
  let foundRole = user[0].roles.find((ea?) => ea._id == req.body.roleId);
  if (foundRole) {
    return next(new Error("Role already in exist"));
  }
  try {
    let result = await userAddRole(user[0]._id, role[0]._id);
    // let result = await userModel.findById(user._id)
    fMsg(res, "role added", result);
  } catch (e: any) {
    next(new Error(e.errors));
  }
};

export const userRemoveRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = await getUser({ _id: req.body.userId });
  // let role = await getRole({_id : req.body.roleId})

  if (!user[0]) {
    return next(new Error("there is no user"));
  }

  let foundRole = user[0].roles.find((ea?) => ea._id == req.body.roleId);
  if (!foundRole) {
    return next(new Error("role not exist"));
  }
  try {
    let result = await userRemoveRole(user[0]._id, req.body.roleId);
    fMsg(res, "role removed", result);
  } catch (e: any) {
    next(new Error(e.errors));
  }
};

export const userAddPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = await getUser({ _id: req.body.userId });
  let permit = await getPermit({ _id: req.body.permitId });

  if (!user[0] || !permit[0]) {
    return next(new Error("there is no permit or user"));
  }
  let foundRole = user[0].permits.find((ea?) => ea._id == req.body.permitId);
  if (foundRole) {
    return next(new Error("permit already in exist"));
  }
  try {
    let result = await userAddPermit(user[0]._id, permit[0]._id);
    // let result = await userModel.findById(user._id)
    fMsg(res, "permit added", result);
  } catch (e: any) {
    next(new Error(e.errors));
  }
};

export const userRemovePermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = await getUser({ _id: req.body.userId });
  // let role = await getRole({_id : req.body.roleId})

  if (!user[0]) {
    return next(new Error("there is no user"));
  }

  let foundRole = user[0].permits.find((ea?) => ea._id == req.body.permitId);
  if (!foundRole) {
    return next(new Error("permit not exist"));
  }
  try {
    let result = await userRemovePermit(user[0]._id, req.body.permitId);
    fMsg(res, "permit removed", result);
  } catch (e: any) {
    next(new Error(e.errors));
  }
};
