const fs = require("fs");

const requestHandler = (req, res) => {
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
};

module.exports = requestHandler;

// following can be accessed in app.js via routes.handler and routes.someText respectively
// module.exports = {
//     handler: requestHandler,
//     someText: "Some hard coded text."
// }

// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard coded text.";

// exports.handler = requestHandler;
// exports.someText = "Some hard coded text.";
