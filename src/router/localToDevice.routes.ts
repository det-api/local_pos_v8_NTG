import {
  connectDeviceHandler,
  devicePermitHandler,
} from "../controller/localToDevice.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { validateToken } from "../middleware/validator";
const localToDeviceRoute = require("express").Router();

localToDeviceRoute.post(
  "/whreq",
  validateToken,
  hasAnyPermit(["add"]),
  connectDeviceHandler
);

localToDeviceRoute.post(
  "/device-permit",
  validateToken,
  hasAnyPermit(["add"]),
  devicePermitHandler
);

// localToDeviceRoute.post("/", updateByDeviceHandler);

export default localToDeviceRoute;
