const http = require("http");

// express.js is all about middleware
/*
    request -> middleware -> maybe another middleware -> response
    the request will funnel through various dev defined middlewares before creating and sending the response
    this allows you to split your code into different blocks to handle differet parts of the response in different middlewares
    this is the pluggable nature of express.js
*/
const express = require("express");

const app = express();

// use: allows us to add a new middleware function
// inside the use will bascially be a function with 3 things
// request, response & next
app.use((req, res, next) => {
  console.log("in the first middleware");
});

const server = http.createServer(app);

server.listen(5000);
