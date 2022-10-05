let users = ["one", "two", "three"];
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>/</title>");
    res.write("</head>");
    res.write("<body>");
    res.write('<h1>Welcome, you are currently in "/" route.</h1>');

    res.write('<form action="/create-user" method="POST">');
    res.write('<input type="text" name="username" />');
    res.write('<button type="submit">Create</button>');

    res.write("</form>");

    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>/users</title>");
    res.write("</head>");
    res.write("<body>");
    res.write("<ul>");
    users.map((user) => res.write("<li>" + user + "</li>"));
    res.write("</ul>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (data) => {
      body.push(data);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      users.push(username);

      res.writeHead(302, { Location: "/users" });
      return res.end();
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head>");
  res.write("<title>Hi</title>");
  res.write("</head>");
  res.write("<body>");
  res.write("<h1>Hi.</h1>");
  res.write("</body>");
  res.write("</html>");
};

module.exports = requestHandler;
