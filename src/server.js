const express = require("express");
const { router } = require("./router.js");
const cors = require("cors");
const app = express();

app.use(router);

// Use the cors middleware to allow the client to access the server
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.listen(5050);
console.log("http://localhost:5050");

exports.app = app;
