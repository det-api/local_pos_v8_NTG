import {
  addDebtHandler,
  deleteDebtHandler,
  getDebtDatePagiHandler,
  getDebtHandler,
  updateDebtHandler,
} from "../controller/debt.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateToken } from "../middleware/validator";

const debtRoute = require("express").Router();

debtRoute.get("/:page", getDebtHandler);

debtRoute.get(
  "/pagi/by-date/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getDebtDatePagiHandler
);

debtRoute.post(
  "/",
  validateToken,
  roleValidator(["manager"]),
  hasAnyPermit(["add"]),
  addDebtHandler
);

debtRoute.patch(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["edit"]),
  updateDebtHandler
);

debtRoute.delete(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["delete"]),
  deleteDebtHandler
);

export default debtRoute;
