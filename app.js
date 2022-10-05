const http = require("http");
const routes = require("./routes");

const server = http.createServer(routes); // this routes function will execute everytime a request reaches the server

server.listen(5000);
