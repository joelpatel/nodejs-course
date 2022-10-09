import express from "express";

import { body } from "express-validator";

import { signup, login } from "../controllers/auth.js";
import User from "../models/user.js";

const router = express.Router();

// PUT /auth/signup
router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists.");
          }
        });
      })
      .normalizeEmail(),
    body("name").trim().isLength({ min: 2 }),
    body("password").trim().not().isEmpty(),
  ],
  signup
);

// POST /auth/login
router.post("/login", login);

export default router;
