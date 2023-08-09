import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface initialSetupDocument extends mongoose.Document {
  nozzleCount: number;
  tankCount: number;
  condition: boolean;
}

const initialSetupSchema = new Schema({
  nozzleCount: { type: Number, required: true, unique: true },
  tankCount: { type: Number, required: true, unique: true },
  conditon: { type: Boolean, default: false },
});

const initialSetupModel = mongoose.model<initialSetupDocument>(
  "initialSetup",
  initialSetupSchema
);
export default initialSetupModel;
