const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const routes = express.Router();

routes.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "root.html"));
});

routes.get("/users", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "users.html"));
});

routes.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

module.exports = routes;
