import { UpdateQuery } from "mongoose";
import detailSaleModel, { detailSaleDocument } from "../model/detailSale.model";

export const deviceLiveData = new Map();

export const liveDataChangeHandler = (data) => {
  try {
    const regex = /[A-Z]/g;

    let liveData: number[] = data.split(regex);

    const value1 = liveData[1] || 0;
    const value2 = liveData[2] || 0;

    deviceLiveData.set(liveData[0], [value1, value2]);
  } catch (e) {
    throw new Error(e);
  }

  // console.log(deviceLiveData.get(liveData[0]));
};

// export const deviceLiveData = new Map();

// export const liveDataChangeHandler = (data) => {
//   try {
//     const regex = /[A-Z]/g;
//     let liveData = data.split(regex);

//     if (liveData && typeof liveData[Symbol.iterator] === "function") {
//       const value1 = liveData[1] || 0;
//       const value2 = liveData[2] || 0;

//       deviceLiveData.set(liveData[0], [value1, value2]);
//       console.log(deviceLiveData.get(liveData[0]));
//     } else {
//       throw new Error("Invalid liveData");
//     }
//   } catch (e) {
//     throw new Error(e);
//   }
// };
