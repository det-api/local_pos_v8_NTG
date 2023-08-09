import mongoose from "mongoose";
import { Schema } from "mongoose";
import moment from "moment-timezone";

export interface debtInput {
  stationDetailId: string;
  couObjId: string;
  vocono: string;
  credit: number;
  deposit: number;
  liter: number;
}

export interface debtDocument extends debtInput, mongoose.Document {
  note: string;
  paided: boolean;
  dateOfDay: string;
  createdAt: Date;
  updatedAt: Date;
}

const debtSchema = new Schema({
  stationDetailId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "stationDetail",
  },
  couObjId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "coustomer",
  },
  vocono: { type: String, require: true, unique: true },
  credit: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  liter: { type: Number, default: 0 },

  note: { type: String, default: null },
  paided: { type: Boolean, default: false },

  dateOfDay: {
    type: String,
    default: new Date().toLocaleDateString(`fr-CA`),
  },
  createdAt: { type: Date, default: Date.now },
});

debtSchema.pre("save", function (next) {
  const options = { timeZone: "Asia/Yangon", hour12: false };
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
  const currentDateTime = new Date().toLocaleTimeString("en-US", options);
  let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);
  this.createdAt = iso;
  this.dateOfDay = currentDate;
  next();
});

const debtModel = mongoose.model<debtDocument>("debt", debtSchema);
export default debtModel;
