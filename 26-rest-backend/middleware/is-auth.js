import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const err = new Error("Authorization token not provided.");
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (err) {
    err.statusCode = 500;
    err.message = "Provided token is invalid.";
    throw err;
  }

  if (!decodedToken) {
    const err = new Error("Token verification failed.");
    err.statusCode = 401;
    throw err;
  }

  /**
   * Execution reaches here, then it means that the user
   * has provided a valid token.
   */
  req.userIDFromJWTToken = decodedToken.userID;
  next();
};

export default isAuth;
