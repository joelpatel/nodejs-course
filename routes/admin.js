const express = require("express");

const router = express.Router(); // mini express app, pluggable into other express apps (main app in app.js)

router.get("/add-product", (req, res, next) => {
  //   console.log("route: /add-product");
  res.send(
    '<form action="/add-product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>'
  );
  //   res.send("<h2>2nd response</h2>"); // won't work, causes an error
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  console.log(req.body.title);
  res.redirect("/");
});

module.exports = router;
