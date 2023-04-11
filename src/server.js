const express = require("express");
const { router } = require("./router.js");
const app = express();

app.use(router);

function add(a, b) {
  return a + b;
}

app.listen(5050);
console.log("http://localhost:5050");

// exports.add = add;
module.exports = add;
