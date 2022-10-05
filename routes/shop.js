const express = require("express");

const router = express.Router();

// use: allows us to add a new middleware function
// inside the use will bascially be a function with 3 things
// request, response & next
router.get("/", (req, res, next) => {
  //   console.log("route: /");
  //   next(); // this allows the request to travel onto the next middleware (top -> bottom)
  res.send("<h1>hello from express</h1>");
});

// router.use((req, res, next) => {
//   //   console.log("in the second middleware");
//   //   console.log("response sent\n");
// });

module.exports = router;
