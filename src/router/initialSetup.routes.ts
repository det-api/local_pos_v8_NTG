import {
  addInitialSetupHandler,
  deletInitialSetupHandler,
  getInitialSetupHandler,
} from "../controller/initialSetup.contoller";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId } from "../schema/schema";

const initialSetupRoute = require("express").Router();

initialSetupRoute.get(
  "/",
  validateToken,
  roleValidator(["admin"]),
  getInitialSetupHandler
);
initialSetupRoute.post(
  "/",
  validateToken,
  // validateAll(initialSetupSchema),
  // roleValidator(["admin"]),
  addInitialSetupHandler
);
initialSetupRoute.delete(
  "/",
  validateToken,
  // validateAll(allSchemaId),
  // roleValidator(["admin"]),
  deletInitialSetupHandler
);

export default initialSetupRoute;
