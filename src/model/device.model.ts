import mongoose, { Schema } from "mongoose";

export interface deviceDocument extends mongoose.Document {
  dep_no: string;
  nozzle_no: string;
  fuel_type: string;
  daily_price: number;
}

const deviceSchema = new Schema(
  {
    dep_no: { type: String, require: true }, //1
    nozzle_no: { type: String, required: true, unique: true }, //5
    fuel_type: { type: String, required: true },
    daily_price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const deviceModel = mongoose.model<deviceDocument>("device", deviceSchema);

export default deviceModel;
