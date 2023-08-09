import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import dailyPriceModel, { dailyPriceDocument } from "../model/dailyPrice.model";

export const getDailyPrice = async (query: FilterQuery<dailyPriceDocument>) => {
  try {
    return await dailyPriceModel.find(query).lean().select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const dailyPricePaginate = async (
  pageNo: number,
  query: FilterQuery<dailyPriceDocument>
): Promise<{ count: number; data: dailyPriceDocument[] }> => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  const data = await dailyPriceModel
    .find(query)
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .select("-__v");

  const count = await dailyPriceModel.countDocuments(query);

  return { data, count };
};

export const addDailyPrice = async (body: dailyPriceDocument) => {
  try {
    return await new dailyPriceModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDailyPrice = async (
  query: FilterQuery<dailyPriceDocument>,
  body: UpdateQuery<dailyPriceDocument>
) => {
  try {
    await dailyPriceModel.updateMany(query, body);
    return await dailyPriceModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDailyPrice = async (
  query: FilterQuery<dailyPriceDocument>
) => {
  try {
    let DailyPrice = await dailyPriceModel.find(query);
    if (!DailyPrice) {
      throw new Error("No DailyPrice with that id");
    }
    return await dailyPriceModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};
