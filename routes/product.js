const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Department = require("../models/department");
const Category = require("../models/category");

router.post("/product/create", async (req, res) => {
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

router.get("/product", async (req, res) => {
  try {
    //  axios.get("http://google.fr").then((response) => {
    //   console.log(response.data);
    // });

    // const response = await axios.get("http://google.fr")
    // console.log(response.data);
    const filters = createFilters(req);

    // Ici, nous construisons notre recherche
    const search = Product.find(filters).populate("reviews");

    if (req.query.sort === "rating-asc") {
      search.sort({ averageRating: 1 });
    } else if (req.query.sort === "rating-desc") {
      search.sort({ averageRating: -1 });
    } else if (req.query.sort === "price-asc") {
      // Ici, nous continuons de construire notre recherche
      search.sort({ price: 1 });
    } else if (req.query.sort === "price-desc") {
      // Ici, nous continuons de construire notre recherche
      search.sort({ price: -1 });
    }

    // Si la page est précisée
    if (req.query.page) {
      const page = req.query.page;
      const limit = 2; // 2 résultats par page

      search.limit(limit); // Limit à X résultats
      search.skip(limit * (page - 1)); // Ignorer X résultats
      // skip doit etre à 0 pour la premiere page
    }

    // Ici, nous executons la recherche
    const products = await search;

    res.json(products);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.post("/product/update", async (req, res) => {
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

router.post("/product/delete", async (req, res) => {
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

module.exports = router;
