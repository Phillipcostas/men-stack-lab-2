// models/food.js

const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    isYourFavorite: Boolean,
  });

  const Food = mongoose.model("Food", foodSchema); // create model

  module.exports = Food