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

const createFilters = req => {
  const filters = {};

  if (req.query.priceMin) {
    filters.price = {};
    filters.price.$gte = req.query.priceMin;
  }
  if (req.query.priceMax) {
    if (filters.price === undefined) {
      filters.price = {};
    }

    filters.price.$lte = req.query.priceMax;
  }

  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.title) {
    filters.title = new RegExp(req.query.title, "i");
  }

  return filters;
};

app.get("/product", async (req, res) => {
  try {
    //  axios.get("http://google.fr").then((response) => {
    //   console.log(response.data);
    // });

    // const response = await axios.get("http://google.fr")
    // console.log(response.data);
    const filters = createFilters(req);

    // Ici, nous construisons notre recherche
    const search = Product.find(filters);

    if (req.query.sort === "price-asc") {
      // Ici, nous continuons de construire notre recherche
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      // Ici, nous continuons de construire notre recherche
      search.sort({ price: -1 });
    }

    // if (req.query.priceMin) {
    //   // ...
    // }

    // Ici, nous executons la recherche
    const products = await search;

    res.json(products);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/product/update", async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    // Est-ce que le produit existe ?
    if (product) {
      product.title = req.body.title;
      product.description = req.body.description;
      product.price = req.body.price;
      product.category = req.body.category;

      await product.save();
      res.json(product);
    } else {
      res.status(400).json({
        message: "Product not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.post("/product/delete", async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product removed" });
    } else {
      res.status(400).json({
        message: "Product not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
