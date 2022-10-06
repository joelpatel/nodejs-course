const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");
const { products } = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("shop", { prods: products, docTitle: "Shop" });
});

module.exports = router;
