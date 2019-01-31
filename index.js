const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose.connect(
  "mongodb://localhost:27017/shop",
  { useNewUrlParser: true }
);

app.post("/department/create", (req, res) => {
  // req.body.title
  res.json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server started");
});
