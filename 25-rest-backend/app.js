import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { config } from "dotenv";

import feedRoutes from "./routes/feed.js";

config(); // load from .env to process.env
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // you could lock it down for for specific domains only by replacing * and for multiple domains separate with ,
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);

/**
 * Error handling express middleware.
 * This will be executed whenever
 * 1) an error is thrown or
 * 2) an error is passed in next().
 */
app.use((error, req, res, next) => {
  console.log(error);
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
