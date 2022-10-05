const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req);
}); // this anonymous function will execute everytime a request reaches the server

server.listen(5000);
