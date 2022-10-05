// express.js is all about middleware
/*
    request -> middleware -> maybe another middleware -> response
    the request will funnel through various dev defined middlewares before creating and sending the response
    this allows you to split your code into different blocks to handle differet parts of the response in different middlewares
    this is the pluggable nature of express.js
*/
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // .urlencoded() yields a middleware function like below ones with next() call at the end but it also helps in getting the body of the request like we did in previous course sections

app.get("/add-product", (req, res, next) => {
  //   console.log("route: /add-product");
  res.send(
    '<form action="/add-product" method="POST"><input type="text" name="title" /><button type="submit">Add Product</button></form>'
  );
  //   res.send("<h2>2nd response</h2>"); // won't work, causes an error
});

app.post("/add-product", (req, res, next) => {
  console.log(req.body);
  console.log(req.body.title);
  res.redirect("/");
});

// use: allows us to add a new middleware function
// inside the use will bascially be a function with 3 things
// request, response & next
app.use("/", (req, res, next) => {
  //   console.log("route: /");
  //   console.log("in the first middleware");
  next(); // this allows the request to travel onto the next middleware (top -> bottom)
});

app.use((req, res, next) => {
  //   console.log("in the second middleware");
  res.send("<h1>hello from express</h1>");
  //   console.log("response sent\n");
});

app.listen(5000);
