const mongoose = require("mongoose");

const Department = mongoose.model("Department", {
  title: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  }
});

module.exports = Department;
