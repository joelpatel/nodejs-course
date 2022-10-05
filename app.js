const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req);
  //   process.exit(0); to exit the event loop
}); // this anonymous function will execute everytime a request reaches the server

server.listen(5000);
