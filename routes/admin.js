const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router(); // mini express app, pluggable into other express apps (main app in app.js)

// NOTE: IMP NOTE: .get() .post() etc. use exact match unlike .use() which matches the starting of the path ✅
// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  console.log(req.body.title);
  res.redirect("/");
});

module.exports = router;
