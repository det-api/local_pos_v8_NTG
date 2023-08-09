 import {
  addDailyPriceHandler,
  deleteDailyPriceHandler,
  getDailyPriceHandler,
  updateDailyPriceHandler,
} from "../controller/dailyPrice.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateToken } from "../middleware/validator";

const dailyPriceRoute = require("express").Router();

dailyPriceRoute.get(
  "/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getDailyPriceHandler
);

dailyPriceRoute.post(
  "/",
  validateToken,
  roleValidator(["manager"]),
  hasAnyPermit(["add"]),
  addDailyPriceHandler
);

dailyPriceRoute.patch(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["edit"]),
  updateDailyPriceHandler
);

dailyPriceRoute.delete(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["delete"]),
  deleteDailyPriceHandler
);

export default dailyPriceRoute;
