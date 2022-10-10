import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from "multer";
import { config } from "dotenv";

import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";
import statusRouter from "./routes/status.js";

config(); // load from .env to process.env
const app = express();

/**
 * Need following 2 lines of code because
 * this is an ES6 module and not a CommonJS module.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));
/** 👆
 * Therefore, whenever 'http://localhost:5000/images/{image_name}' url is hit
 * the server responds with that image and causes the receiver to download the
 * image.
 */

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // you could lock it down for specific domains only by replacing * and for multiple domains separate with ,
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ANY method & /feed + whatever after feed in path of req url
app.use("/feed", feedRoutes);
app.use("/status", statusRouter);
app.use("/auth", authRoutes);

/**
 * Error handling express middleware.
 * This will be executed whenever
 * 1) an error is thrown or
 * 2) an error is passed in next().
 */
app.use((error, req, res, next) => {
  const status = error.statusCode || 500; // default value will be 500
  const message = error.message; // default property (what we pass as an argument to the constructor)
  const errors = error.errors || [];
  res.status(status).json({ message, errors });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.ccmd1sr.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then((_) => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
