import mongoose from "mongoose";
import { Schema } from "mongoose";
import moment, { MomentTimezone } from "moment-timezone";

const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

export interface fuelInDocument extends mongoose.Document {
  stationId: string;
  driver: string;
  tankNo: string;
  bowser: string;
  fuel_type: string;
  fuel_in_code: number;
  tank_balance: number;
  recive_balance: number;
  receive_date: string;
}

const fuelInSchema = new Schema({
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "stationDetail",
    default: "6464e9f1c45b82216ab1db6b",
  },
  driver: { type: String, required: true },
  bowser: { type: String, required: true },
  tankNo: { type: String, required: true },
  fuel_type: { type: String, required: true },
  fuel_in_code: { type: Number, required: true },
  tank_balance: { type: Number, required: true },
  recive_balance: { type: Number, required: true },
  receive_date: { type: String, default: new Date() },
  createAt: { type: Date, default: new Date() },
});

fuelInSchema.pre("save", function (next) {

  const options = { timeZone: "Asia/Yangon", hour12: false };

  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
  const currentDateTime = new Date().toLocaleTimeString("en-US", options);

  let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);

  this.createAt = iso;
  this.receive_date = currentDate;
  next();
});

const fuelInModel = mongoose.model<fuelInDocument>("fuelIn", fuelInSchema);

export default fuelInModel;
