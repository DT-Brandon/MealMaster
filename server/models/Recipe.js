const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      default: "Meal Master User",
    },
    userId: {
      type: String,
    },
    title: {
      type: String,
      require: true,
      min: 3,
      max: 30,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    picture: {
      type: String,
    },
    directions: {
      type: Array,
      default: [],
      required: true,
    },
    desc: {
      type: String,
      max: 100,
      required: true,
    },
    servings: {
      type: Number,
    },
    preparationTime: {
      type: String,
      required: true,
    },
    notes: {
      type: Array,
    },
    comments: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    cuisine: {
      type: String,
      default: "default",
    },
    diet: {
      type: String,
    },
    intolerances: {
      type: Array,
      default: [],
    },
    calories: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
