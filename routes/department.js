const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Department = require("../models/department");
const Category = require("../models/category");

router.post("/department/create", async (req, res) => {
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

router.get("/department", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.post("/department/update", async (req, res) => {
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

router.post("/department/delete", async (req, res) => {
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

      // TODO
      // Delete categories

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

module.exports = router;
