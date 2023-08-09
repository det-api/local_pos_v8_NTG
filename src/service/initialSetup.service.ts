import { FilterQuery, UpdateQuery } from "mongoose";
import initialSetupModel, {
  initialSetupDocument,
} from "../model/initialSetup.model";

export const getInitialSetup = async (
  query: FilterQuery<initialSetupDocument>
) => {
  try {
    return await initialSetupModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const initialSetupCount = async () => {
  return await initialSetupModel.countDocuments();
};

export const addInitialSetup = async (body: initialSetupDocument) => {
  try {
    return await new initialSetupModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteInitialSetup = async (
  query: FilterQuery<initialSetupDocument>
) => {
  try {
    return await initialSetupModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};
export const updateInitialSetup = async (
  query: FilterQuery<initialSetupDocument>,
  body: UpdateQuery<initialSetupDocument>
) => {
  try {
    await initialSetupModel.updateMany(query, body);
    return await initialSetupModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};
