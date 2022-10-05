const express = require("express");

const app = express();

// Part 3 of Assignment 2
app.use("/users", (req, res, next) => {
  console.log("route: /users");
  res.send("<h1>route: /users</h1>");
});

app.use("/", (req, res, next) => {
  console.log("route: /");
  res.send("<h1>route: /</h1>");
});

/* 
// Part 2 of Assignment 2
app.use((req, res, next) => {
  console.log("part 2 first middleware");
  next();
});

app.use((req, res, next) => {
  console.log("part 2 second middleware");
  res.send("<h1>Part 2 of Assignment 2 Done!<h1>");
});
*/

app.listen(5000);
