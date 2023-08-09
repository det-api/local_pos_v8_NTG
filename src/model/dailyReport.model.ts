import mongoose, { Schema } from "mongoose";
import moment, { MomentTimezone } from "moment-timezone";

export interface dailyReportDocument extends mongoose.Document {
  stationId: string;
  dateOfDay: string;
  date: Date;
}

const dailyReportSchema = new Schema({
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "stationDetail",
    required: true,
  },
  dateOfDay: { type: String, default: new Date().toLocaleDateString(`fr-CA`) },
  date: { type: Date, default: new Date() },
});

dailyReportSchema.pre("save", function (next) {
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

  if (this.dateOfDay) {
    next();
  } else {
    this.dateOfDay = currentDate;
    next();
  }
});

const dailyReportModel = mongoose.model<dailyReportDocument>(
  "dailyReport",
  dailyReportSchema
);

export default dailyReportModel;
