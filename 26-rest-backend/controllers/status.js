import { validationResult } from "express-validator";

import User from "../models/user.js";

const updateStatus = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Status not provided.");
    err.statusCode = 422;
    err.errors = errors.array();
    throw err;
  }

  User.findById(req.userIDFromJWTToken)
    .then((user) => {
      if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
      }

      user.status = req.body.status;
      return user.save();
    })
    .then((updatedUser) => {
      res.status(200).json({
        message: "status updated successfully",
        status: updatedUser.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const getStatus = (req, res, next) => {
  User.findById(req.userIDFromJWTToken)
    .then((user) => {
      if (!user) {
        const err = new Error("User not found.");
        err.statusCode = 404;
        throw err;
      }

      res.status(200).json({
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export { updateStatus, getStatus };
