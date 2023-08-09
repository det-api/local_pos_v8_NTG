import { FilterQuery } from "mongoose";
import roleModel, { roleDocument } from "../model/role.model";
import { permitDocument } from "../model/permit.model";

export const getRole = async (query: FilterQuery<roleDocument>) => {
  try {
    return await roleModel
      .find(query)
      .lean()
      .populate("permits")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addRole = async (body: roleDocument) => {
  try {
    return await new roleModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteRole = async (query: FilterQuery<roleDocument>) => {
  try {
    return await roleModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const roleAddPermit = async (
  roleId: FilterQuery<roleDocument>,
  permitId: permitDocument["_id"]
) => {
  try {
    await roleModel.findByIdAndUpdate(roleId, { $push: { permits: permitId } });
    return roleModel.findById(roleId);
  } catch (e) {
    throw new Error(e);
  }
};

export const roleRemovePermit = async (
  roleId: FilterQuery<roleDocument>,
  permitId: permitDocument["_id"]
) => {
  try {
    await roleModel.findByIdAndUpdate(roleId, { $pull: { permits: permitId } });
    return roleModel.findById(roleId);
  } catch (e) {
    throw new Error(e);
  }
};
