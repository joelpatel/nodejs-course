const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

/*
 * Allows us to set any values globally on our express application.
 * This can also be keys and/or configuration items that express doesn't understand.
 * Like Java's setter and getter. It can also be retrieved by app.get("name").
 */
app.set("view engine", "pug");
app.set("views", "views"); // this is also the default value so it is not needed in current setup

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  console.log("requested page not found");
  res
    .status(404)
    .sendFile(path.join(__dirname, "views", "page-not-found.html"));
});

app.listen(5000);
