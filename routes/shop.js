const express = require("express");

const router = express.Router();

// use: allows us to add a new middleware function
// inside the use will bascially be a function with 3 things
// request, response & next
router.use("/", (req, res, next) => {
  //   console.log("route: /");
  //   console.log("in the first middleware");
  next(); // this allows the request to travel onto the next middleware (top -> bottom)
});

router.use((req, res, next) => {
  //   console.log("in the second middleware");
  res.send("<h1>hello from express</h1>");
  //   console.log("response sent\n");
});

module.exports = router;
