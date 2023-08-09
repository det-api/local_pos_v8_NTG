import {
  addCoustomerHandler,
  deletCoustomerHandler,
  getCoustomerHandler,
  searchCoustomerHandler,
} from "../controller/coustomer.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateToken } from "../middleware/validator";

const coustomerRoute = require("express").Router();

coustomerRoute.get(
  "/",
  validateToken,
  hasAnyPermit(["view"]),
  getCoustomerHandler
);
coustomerRoute.post(
  "/",
  validateToken,
  roleValidator(["manager", "admin"]),
  hasAnyPermit(["add"]),
  addCoustomerHandler
);
coustomerRoute.delete(
  "/",
  validateToken,
  roleValidator(["manager", "admin"]),
  hasAnyPermit(["delete"]),
  deletCoustomerHandler
);

coustomerRoute.get(
  "/search",
  validateToken,
  hasAnyPermit(["view"]),
  searchCoustomerHandler
);

export default coustomerRoute;
