import {
  addFuelBalanceHandler,
  deleteFuelBalanceHandler,
  getAllFuelBalanceHandler,
  getFuelBalanceByDateHandler,
  getFuelBalanceHandler,
  updateFuelBalanceHandler,
} from "../controller/fuelBalance.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import {
  validateAll,
  validateToken,
  validateToken2,
} from "../middleware/validator";
import { fuelBalanceSchema } from "../schema/schema";
const fuelBalanceRoute = require("express").Router();

fuelBalanceRoute.get(
  "/all",
  validateToken2,
  roleValidator(["admin", "installer", "manager"]),
  getAllFuelBalanceHandler
);

fuelBalanceRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getFuelBalanceHandler
);

fuelBalanceRoute.get(
  "/by-date",
  validateToken,
  hasAnyPermit(["view"]),
  getFuelBalanceByDateHandler
);

fuelBalanceRoute.post(
  "/",
  validateToken2,
  // validateAll(fuelBalanceSchema),
  roleValidator(["admin", "installer"]),
  hasAnyPermit(["add"]),
  addFuelBalanceHandler
);

fuelBalanceRoute.patch(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["edit"]),
  updateFuelBalanceHandler
);

fuelBalanceRoute.delete(
  "/",
  validateToken2,
  roleValidator(["admin", "installer"]),
  // hasAnyPermit(["delete"]),
  deleteFuelBalanceHandler
);

export default fuelBalanceRoute;
