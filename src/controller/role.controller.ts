import { Request, Response, NextFunction } from "express";
import { getPermit } from "../service/permit.service";
import {
  getRole,
  addRole,
  deleteRole,
  roleAddPermit,
  roleRemovePermit,
} from "../service/role.service";
import fMsg from "../utils/helper";

export const getRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await getRole(req.query);
    fMsg(res, "Role are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addRole(req.body);
    fMsg(res, "New Role was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deletRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteRole(req.query);
    fMsg(res, "Role was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const roleAddPermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let role = await getRole({ _id: req.body.roleId });
    let permit = await getPermit({ _id: req.body.permitId });
    if (!role[0] || !permit[0]) {
      next(new Error("role or permit not found"));
    }
    let foundRole = role[0].permits.find(
      (ea: any) => ea._id == req.body.permitId
    );
    if (foundRole) {
      return next(new Error("Permit already in exist"));
    }
    let result = await roleAddPermit(req.body.roleId, req.body.permitId);
    fMsg(res, "permit added ", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const roleRemovePermitHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let role = await getRole({ _id: req.body.roleId });
    let dbpermit = role[0]["permits"].find(
      (ea: {}) => ea["_id"] == req.body.permitId
    );
    if (!role || !dbpermit) {
      throw new Error("role or permit not found");
    }
    let result = await roleRemovePermit(req.body.roleId, req.body.permitId);
    fMsg(res, "permit removed ", result);
  } catch (e) {
    next(new Error(e));
  }
};
