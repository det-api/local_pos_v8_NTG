import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface coustomerDocument extends mongoose.Document {
  cou_name: string;
  cou_id: string;
  cou_debt: number;
  cou_phone: number;
  cou_address: string;
  com_register_no: string;
  contact_person_name: string;
  contact_person_phone: number;
  limitAmount: number;
}

const coustomerSchema = new Schema(
  {
    cou_name: { type: String, required: true, unique: true },
    cou_id: { type: String, unique: true },
    cou_phone: { type: Number, unique: true },

    cou_sec_phone: { type: Number, unique: true },

    cou_address: { type: String, required: true },

    com_register_no: { type: String, default: null },

    contact_person_name: { type: String, required: true },

    contact_person_phone: { type: Number, required: true },

    contact_person_sec_phone: { type: Number, required: true },

    limitAmount: { type: Number, default: 0 },

    cou_debt: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

coustomerSchema.pre("save", function (next) {
  this.cou_name = this.cou_name.toLowerCase();
  this.cou_id = uuidv4().substr(0, 6);
  next();
});

const coustomerModel = mongoose.model<coustomerDocument>(
  "coustomer",
  coustomerSchema
);

export default coustomerModel;
