const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Department = require("../models/department");
const Category = require("../models/category");

router.post("/category/create", async (req, res) => {
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

router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find().populate("department");
    res.json(categories);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.post("/category/update", async (req, res) => {
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

router.post("/category/delete", async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);
    if (category) {
      await category.remove();
      // TODO
      // Delete products
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

module.exports = router;
