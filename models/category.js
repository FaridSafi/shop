const mongoose = require("mongoose");

const Category = mongoose.model("Category", {
  title: {
    type: String,
    minlength: 5,
    maxlength: 15,
    required: true
  },
  description: {
    type: String
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});

module.exports = Category;
