const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);

  res.setHeader("Content-Type", "text/html");
  res.write("<html><head><title>Response Page</title></head>");
  res.write("<body><h1>Hi</h1></body>");
  res.write("</html>");
  res.end();

  //   process.exit(0); to exit the event loop
}); // this anonymous function will execute everytime a request reaches the server

server.listen(5000);
