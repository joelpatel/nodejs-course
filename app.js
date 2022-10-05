const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  //   console.log(req.url, req.method, req.headers);
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (data) => {
      //   console.log(data);
      body.push(data);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.appendFile("message.txt", message + "\n", (err) => {
        res.writeHead(302, { Location: "/" });
        /*
              res.statusCode = 302;
              res.setHeader("Location", "/");
           */
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Response Page</title></head>");
  res.write("<body><h1>Hi</h1></body>");
  res.write("</html>");
  res.end();

  //   process.exit(0); to exit the event loop
}); // this anonymous function will execute everytime a request reaches the server

server.listen(5000);
