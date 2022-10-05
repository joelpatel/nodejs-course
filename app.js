// express.js is all about middleware
/*
    request -> middleware -> maybe another middleware -> response
    the request will funnel through various dev defined middlewares before creating and sending the response
    this allows you to split your code into different blocks to handle differet parts of the response in different middlewares
    this is the pluggable nature of express.js
*/
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // .urlencoded() yields a middleware function like below ones with next() call at the end but it also helps in getting the body of the request like we did in previous course sections

// app.use(adminRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  console.log("requested page not found");
  res.status(404).send("<h1>404 Page Not Found</h1>"); // send needs to be last
});

app.listen(5000);
