const userRoute = require("express").Router();
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";

import {
  validateAll,
  validateToken,
  validateToken2,
} from "../middleware/validator";

import {
  deleteUserHandler,
  getUserByAdminHandler,
  getUserHandler,
  loginUserHandler,
  registerUserHandler,
  updateUserHandler,
  userAddPermitHandler,
  userAddRoleHandler,
  userRemovePermitHandler,
  userRemoveRoleHandler,
} from "../controller/user.controller";

import {
  createUserSchema,
  loginUserSchema,
  userPermitSchema,
  userRoleSchema,
} from "../schema/schema";

//register user
userRoute.post("/register", validateAll(createUserSchema), registerUserHandler);

//login user
userRoute.post("/login", validateAll(loginUserSchema), loginUserHandler);

//update
userRoute.patch(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["edit"]),
  updateUserHandler
);

//getuser
userRoute.get("/", validateToken, getUserHandler);

//delete each user
userRoute.delete(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["delete"]),
  deleteUserHandler
);

//admin routes
//beware deleting all user route
userRoute.delete(
  "/admin",
  validateToken,
  roleValidator(["admin"]),
  deleteUserHandler
);

userRoute.get(
  "/admin",
  validateToken2,
  roleValidator(["admin", "installer"]),
  getUserByAdminHandler
);

//adding role in user
userRoute.patch(
  "/add/role",
  validateToken2,
  validateAll(userRoleSchema),
  roleValidator(["admin", "installer"]),
  hasAnyPermit(["add"]),
  userAddRoleHandler
);

userRoute.patch(
  "/remove/role",
  validateToken2,
  validateAll(userRoleSchema),
  roleValidator(["admin", "installer"]),
  hasAnyPermit(["delete"]),
  userRemoveRoleHandler
);

//adding permit in user
userRoute.patch(
  "/add/permit",
  validateToken2,
  validateAll(userPermitSchema),
  roleValidator(["admin", "installer"]),
  hasAnyPermit(["add"]),
  userAddPermitHandler
);

userRoute.patch(
  "/remove/permit",
  validateToken2,
  validateAll(userPermitSchema),
  roleValidator(["admin", "installer"]),
  hasAnyPermit(["delete"]),
  userRemovePermitHandler
);

export default userRoute;
