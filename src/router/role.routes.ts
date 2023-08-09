import {
  getRoleHandler,
  addRoleHandler,
  deletRoleHandler,
  roleAddPermitHandler,
  roleRemovePermitHandler,
} from "../controller/role.controller";
import { roleValidator } from "../middleware/roleValidator";
import {
  validateAll,
  validateToken,
  validateToken2,
} from "../middleware/validator";
import { allSchemaId, rolePermitSchema, roleSchema } from "../schema/schema";

const roleRoute = require("express").Router();

roleRoute.get(
  "/",
  validateToken2,
  roleValidator(["admin", "installer"]),
  getRoleHandler
);

roleRoute.post(
  "/",
  validateToken,
  validateAll(roleSchema),
  roleValidator(["admin"]),
  addRoleHandler
);

roleRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["admin"]),
  deletRoleHandler
);

roleRoute.patch(
  "/add/permit",
  validateToken,
  validateAll(rolePermitSchema),
  roleValidator(["admin"]),
  roleAddPermitHandler
);

roleRoute.patch(
  "/remove/permit",
  validateToken,
  validateAll(rolePermitSchema),
  roleValidator(["admin"]),
  roleRemovePermitHandler
);

export default roleRoute;
