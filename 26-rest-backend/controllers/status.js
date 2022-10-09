import { validationResult } from "express-validator";

import User from "../models/user.js";

const updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Status not provided.");
    err.statusCode = 422;
    err.errors = errors.array();
    throw err;
  }

  try {
    const user = await User.findById(req.userIDFromJWTToken);
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }

    user.status = req.body.status;
    const updatedUser = await user.save();
    res.status(200).json({
      message: "status updated successfully",
      status: updatedUser.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userIDFromJWTToken);
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      status: user.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export { updateStatus, getStatus };
