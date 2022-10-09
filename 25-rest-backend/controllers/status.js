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

  console.log("requested status: " + req.body.status);
  User.findById(req.userIDFromJWTToken)
    .then((user) => {
      user.status = req.body.status;
      return user.save();
    })
    .then((updatedUser) => {
      console.log("updated status: " + updatedUser.status);
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
