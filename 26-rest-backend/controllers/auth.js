import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

import User from "../models/user.js";

config();

const signup = async (req, res, next) => {
  /**
   * checking if validation errors are present
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed. Invalid input. Please try again."
    );
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    const result = await user.save();
    res.status(201).json({
      message: "User created!",
      userID: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error("Please enter valid information.");
      err.statusCode = 401; // 401 -> not authenticated
      throw err;
    }

    /**
     * Valid email address.
     * Now, validate the password.
     */
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Please enter valid information.");
      err.statusCode = 401;
      throw err;
    }
    /**
     * email and password matches
     */
    const token = jwt.sign(
      {
        email: user.email,
        userID: user._id.toString(),
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token,
      userID: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export { signup, login };
