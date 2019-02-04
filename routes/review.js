const express = require("express");
const router = express.Router();

const Review = require("../models/review");
const Product = require("../models/product");

// product (identifiant du produit associé à l'avis).
// Attention : Vous ne devrez pas ajouter d'attribut product à la collection Review. Cette valeur sera utile pour retrouver le produit à mettre à jour.
// rating (nouvelle note)
// comment (nouveau commentaire)
// username (nom de l'utilisateur)

const calculateRating = product => {
  // Si il n'y a pas d'avis, la note est égale à 0
  if (product.reviews.length === 0) {
    return 0;
  }

  let rating = 0;

  for (let i = 0; i < product.reviews.length; i++) {
    rating = rating + product.reviews[i].rating;
  }

  rating = rating / product.reviews.length;

  rating = Number(rating.toFixed(1)); // Attention : Retourne une variable de type String

  return rating;
};

router.post("/review/update", async (req, res) => {
  try {
    // Modifier l'avis ayant l'id req.query.id
    const review1 = await Review.findById(req.query.id);

    if (review) {
      review.comment = req.body.comment;
      review.rating = req.body.rating;
      await review.save();

      // Chercher un produit associé à un ou plusieurs avis
      const product = await Product.findOne({
        reviews: { $in: [req.query.id] }
      }).populate("reviews");

      // Mettre à jour la note moyenne
      const rating = calculateRating(product);
      product.averageRating = rating;

      await product.save();
      res.json(review);
    } else {
      res.status(400).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/review/create", async (req, res) => {
  try {
    const product = await Product.findById(req.body.product).populate(
      "reviews"
    );

    if (product) {
      // Garantir l'existance du tableau reviews
      if (product.reviews === undefined) {
        product.reviews = [];
      }

      const review = new Review({
        rating: req.body.rating,
        comment: req.body.comment,
        username: req.body.username
      });

      await review.save();

      // Ajoute l'avis dans le produit
      product.reviews.push(review);

      // Mettre à jour la note moyenne
      const rating = calculateRating(product);
      product.averageRating = rating;

      // Sauvegarder les modifications du produit
      await product.save();

      res.json(review);
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
