const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/shop", {
  useNewUrlParser: true
});

// Initialiser les collections
// Mongoose va prendre connaissance de ces collections
require("./models/product");
require("./models/department");
require("./models/category");
require("./models/review");

const departmentRoutes = require("./routes/department");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const reviewRoutes = require("./routes/review");

// Activer les routes
app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(reviewRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
