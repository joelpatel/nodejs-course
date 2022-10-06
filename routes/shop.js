const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");
const { products } = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("products: ");
  console.log(products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
