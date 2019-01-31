const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose.connect(
  "mongodb://localhost:27017/shop",
  { useNewUrlParser: true }
);

const Product = require("./models/product");
const Department = require("./models/department");
const Category = require("./models/category");

const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

app.listen(3000, () => {
  console.log("Server started");
});
