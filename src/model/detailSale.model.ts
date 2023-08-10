import mongoose, { Schema } from "mongoose";
import { getDailyReportByDate } from "../service/dailyReport.service";
import moment from "moment-timezone";

export interface detailSaleDocument extends mongoose.Document {
  stationDetailId: string;
  dailyReportDate: string;
  vocono: string;
  carNo: string;
  vehicleType: string;
  nozzleNo: string;
  fuelType: string;
  cashType: string;
  casherCode: string;
  couObjId: string;
  asyncAlready: string;
  salePrice: number;
  saleLiter: number;
  totalPrice: number;
  totalizer_liter: number;
  totalizer_amount: number;
  isError: boolean;
  preset: string;
  device: string;
  createAt: Date;
}

const detailSaleSchema = new Schema({
  stationDetailId: {
    type: String,
    required: true,
    ref: "stationDetail",
  },
  vocono: { type: String, required: true, unique: true },
  carNo: { type: String, required: true },
  vehicleType: { type: String, required: true },
  nozzleNo: { type: String, required: true },
  fuelType: { type: String, required: true },

  cashType: {
    type: String,
    default: "paided",
    // enum: ["Cash", "KBZ_Pay", "Credit", "FOC", "Debt", "Others"],
  },
  casherCode: { type: String, required: true },
  couObjId: { type: Schema.Types.ObjectId, default: null },
  asyncAlready: {
    type: String,
    default: "0",
    enum: ["0", "1", "2"],
  },

  salePrice: { type: Number, default: 0 },
  saleLiter: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  totalizer_liter: { type: Number, default: 0 },
  totalizer_amount: { type: Number, default: 0 },

  dailyReportDate: {
    type: String,
    default: new Date().toLocaleDateString("fr-CA"),
  },
  isError: { type: Boolean, default: false },
  preset: { type: String, default: null },
  device: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

detailSaleSchema.pre("save", function (next) {
  if (this.vehicleType == "Cycle" && this.carNo == null) {
    this.carNo = "-";
  }
  // const options = { timeZone: "Asia/Yangon", hour12: false };

  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

  if (this.dailyReportDate) {
    next();
  }

  this.dailyReportDate = currentDate;

  next();
});

const detailSaleModel = mongoose.model<detailSaleDocument>(
  "detailSale",
  detailSaleSchema
);

export default detailSaleModel;
