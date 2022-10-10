import express from "express";
import { body } from "express-validator";

import { updateStatus, getStatus } from "../controllers/status.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.put(
  "/update",
  isAuth,
  [body("status").trim().not().isEmpty()],
  updateStatus
);

router.get("/get", isAuth, getStatus);

export default router;
