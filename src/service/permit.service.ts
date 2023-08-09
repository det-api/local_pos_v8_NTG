import permitModel, { permitDocument } from "../model/permit.model";
import { FilterQuery } from "mongoose";

export const getPermit = async (query: FilterQuery<permitDocument>) => {
  try {
    return await permitModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const addPermit = async (body: permitDocument) => {
  try {
    return await new permitModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const deletePermit = async (query: FilterQuery<permitDocument>) => {
  try {
    return await permitModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};
