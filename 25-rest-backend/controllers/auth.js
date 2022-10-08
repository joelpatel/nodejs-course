import { validationResult } from "express-validator";

import User from "../models/user.js";

const signup = (req, res, next) => {
  /**
   * checking if validation errors are present
   */
  const errors = validationResult();
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed. Invalid input. Please try again."
    );
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.email;
  const name = req.body.name;
};

export { signup };
