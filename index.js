const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());

mongoose.connect(
  "mongodb://localhost:27017/shop",
  { useNewUrlParser: true }
);

const Department = mongoose.model("Department", {
  title: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true
  }
});

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

const Product = mongoose.model("Product", {
  title: {
    type: String,
    minlength: 5,
    maxlength: 25,
    required: true
  },
  description: {
    type: String,
    minlength: 0,
    maxlength: 500,
    default: "",
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

app.post("/department/create", async (req, res) => {
  try {
    // Notre sauvegarde
    const department = new Department({
      title: req.body.title
    });

    await department.save();

    res.json(department);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.get("/department", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/department/update", async (req, res) => {
  // req.query.id

  try {
    const department = await Department.findById(req.query.id);

    // Est-ce que department existe ?
    if (department) {
      department.title = req.body.title;
      await department.save();
      res.json(department);
    } else {
      res.status(400).json({
        message: "Department not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/department/delete", async (req, res) => {
  try {
    const department = await Department.findById(req.query.id);
    if (department) {
      await department.remove();

      // Supprimer aussi les categories
      const categories = await Category.find({
        department: req.query.id
      });

      // Version 1
      // for (let i = 0; i < categories.length; i++) {
      //   await categories[i].remove();
      // }
      // Version 2
      await categories.remove();

      res.json({ message: "Department removed" });
    } else {
      res.status(400).json({
        message: "Department not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/category/create", async (req, res) => {
  try {
    // Notre sauvegarde
    const category = new Category({
      title: req.body.title,
      department: req.body.department
    });

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("department");
    res.json(categories);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/category/update", async (req, res) => {
  // req.query.id

  try {
    const category = await Category.findById(req.query.id);
    const department = await Department.findById(req.body.department);

    // Est-ce que la categorie existe ?
    if (category && department) {
      category.title = req.body.title;
      category.description = req.body.description;
      category.department = req.body.department;

      await category.save();
      res.json(category);
    } else {
      res.status(400).json({
        message: "Category or department not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/category/delete", async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    if (category) {
      await category.remove();
      res.json({ message: "Category removed" });
    } else {
      res.status(400).json({
        message: "Category not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/product/create", async (req, res) => {
  try {
    // Notre sauvegarde
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category
    });

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
