import { FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import debtModel, { debtDocument, debtInput } from "../model/debt.model";
import { getCoustomerById, updateCoustomer } from "./coustomer.service";

export const getDebt = async (query: FilterQuery<debtDocument>) => {
  try {
    return await debtModel
      .find(query)
      .populate("couObjId")
      .lean()
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const DebtPaginate = async (
  pageNo: number,
  query: FilterQuery<debtDocument>
): Promise<{ count: number; data: debtDocument[] }> => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  const data = await debtModel
    .find(query)
    .populate("couObjId")
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .select("-__v");

  const count = await debtModel.countDocuments(query);

  return { data, count };
};

export const addDebt = async (body: debtInput) => {
  try {
    let coustomerConditon = await getCoustomerById(body.couObjId);

    if (!coustomerConditon)
      throw new Error("There is no coustomer with that name");

    return await new debtModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const countDebt = async (query: FilterQuery<debtDocument>) => {
  return await debtModel.countDocuments(query);
};

export const updateDebt = async (
  query: FilterQuery<debtDocument>,
  body: UpdateQuery<debtDocument>
) => {
  try {
    await debtModel.updateMany(query, body);
    return await debtModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDebt = async (query: FilterQuery<debtDocument>) => {
  try {
    let Debt = await debtModel.find(query);
    if (!Debt) {
      throw new Error("No Debt with that id");
    }
    return await debtModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const detailSaleByDateAndPagi = async (
  query: FilterQuery<debtDocument>,
  d1: Date,
  d2: Date,
  pageNo: number
): Promise<{ count: number; data: debtDocument[] }> => {
  try {
    const limitNo = config.get<number>("page_limit");

    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    const filter: FilterQuery<debtDocument> = {
      ...query,
      createdAt: {
        $gt: d1,
        $lt: d2,
      },
    };
    const dataQuery = await debtModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limitNo)
      .populate("couObjId")
      .select("-__v");

    const countQuery = debtModel.countDocuments(filter);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count };
  } catch (error) {
    // console.error("Error in detailSaleByDateAndPagi:", error);
    throw error;
  }
};
