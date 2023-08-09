import { FilterQuery } from "mongoose";
import coustomerModel, { coustomerDocument } from "../model/coustomer.model";
import { UpdateQuery } from "mongoose";
import axios from "axios";
import config from "config";
import { getCredentialUser } from "./user.service";
import { compass } from "../utils/helper";

export const getCoustomer = async (query: FilterQuery<coustomerDocument>) => {
  try {
    return await coustomerModel.find(query).lean().select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const getCoustomerById = async (id: string) => {
  try {
    return await coustomerModel.findById(id).select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addCoustomer = async (body) => {
  try {
    let [email, password] = await getCredentialUser({
      email: body.email,
    });
    if (!email || !compass(body.password, password)) {
      throw new Error("Creditial Error");
    }
    body = {
      ...body,
      email,
      password: body.password,
    };

    let url = config.get<string>("coustomerCloudUrl");
    let response = await axios.post(url, body);

    return await new coustomerModel(response.data.result).save();
  } catch (e) {
    throw new Error(e.response.data.msg);
  }
};

export const updateCoustomer = async (
  id: string,
  body: UpdateQuery<coustomerDocument>
) => {
  try {
    await coustomerModel.findByIdAndUpdate(id, body).select("-password -__v");
    return await coustomerModel.findById(id).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteCoustomer = async (
  query: FilterQuery<coustomerDocument>
) => {
  try {
    return await coustomerModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const searchCoustomer = async (query) => {
  try {
    let key = query.key.toLowerCase();
    if (typeof key !== "string") {
      throw new Error("Invalid search key. Expected a string.");
    }
    let result = await coustomerModel.find({
      $or: [{ cou_name: { $regex: key } }],
    });
    return result;
  } catch (e) {
    throw new Error(e);
  }
};
