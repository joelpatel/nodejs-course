const path = require("path");

const express = require("express");

const rootDir = require("../utils/path");

const router = express.Router(); // mini express app, pluggable into other express apps (main app in app.js)

// NOTE: IMP NOTE: .get() .post() etc. use exact match unlike .use() which matches the starting of the path ✅
// /admin/add-product => GET
router.get("/add-product", (req, res, next) => {
  //   console.log("route: /add-product");
  // res.send(
  //   // action can also be = "./add-product"
  //   '<form action="./add-product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>'
  // );
  //   res.send("<h2>2nd response</h2>"); // won't work, causes an error

  // res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  console.log(req.body.title);
  res.redirect("/");
});

module.exports = router;
