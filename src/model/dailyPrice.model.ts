import mongoose, { Schema } from "mongoose";

export interface dailyPriceDocument extends mongoose.Document {
  ninety_two: number;
  ninety_five: number;
  HSD: number;
  PHSD: number;
  dateOfDay: string;
  createdAt: Date;
}

const dailyPriceSchema = new Schema({
  ninety_two: { type: Number, required: true },
  ninety_five: { type: Number, required: true },
  HSD: { type: Number, required: true },
  PHSD: { type: Number, required: true },
  dateOfDay: { type: String, default: new Date().toLocaleDateString(`fr-CA`) },
  createdAt: { type: Date, default: Date.now() },
});

const dailyPriceModel = mongoose.model<dailyPriceDocument>(
  "dailyPrice",
  dailyPriceSchema
);
export default dailyPriceModel;
