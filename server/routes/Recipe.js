const router = require("express").Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");

//create a recipe

router.post("/add", async (req, res) => {
  const newRecipe = new Recipe(req.body);
  try {
    const savedRecipe = await newRecipe.save();
    res.status(200).json(savedRecipe);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a recipe

router.put("/update/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe?.userId === req.body.userId) {
      await recipe.updateOne({ $set: req.body });
      res.status(200).json("the recipe has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a recipe

router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe.userId === req.body.userId) {
      await recipe.deleteOne();
      res.status(200).json("the recipe has been deleted");
    } else {
      res.status(403).json("you can delete only your recipe");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / unlike a recipe

router.put("/:id/like", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe.likes.includes(req.body.userId)) {
      if (recipe.dislikes.includes(req.body.userId)) {
        await recipe.updateOne({ $pull: { dislikes: req.body.userId } });
      }
      await recipe.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The recipe has been liked");
    } else {
      await recipe.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The recipe has been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//dislike / undislike a recipe

router.put("/:id/dislike", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe.dislikes.includes(req.body.userId)) {
      if (recipe.likes.includes(req.body.userId)) {
        await recipe.updateOne({ $pull: { likes: req.body.userId } });
      }
      await recipe.updateOne({ $push: { dislikes: req.body.userId } });
      res.status(200).json("The recipe has been disliked");
    } else {
      await recipe.updateOne({ $pull: { dislikes: req.body.userId } });
      res.status(200).json("The post has been undisliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a recipe

router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const currentUser = await User.findById(recipe.userId);
    let newRecipe = recipe;
    newRecipe.userId = currentUser?.username;
    res.status(200).json(newRecipe);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all recipe

router.get("/user/all", async (req, res) => {
  try {
    const recipes = await Recipe.find({ source: "Meal Master User" });
    const recipesFinal = await Promise.all(
      recipes.map(async (recipe) => {
        let newRecipe = recipe;
        const currentUser = await User.findById(recipe.userId);
        newRecipe.userId = currentUser?.username;
        return newRecipe;
      })
    );
    res.status(200).json(recipesFinal);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//comment a recipe

router.put("/:id/comment", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    await recipe.updateOne({ $push: { comments: req.body } });
  } catch (err) {
    res.status(500).json(err);
  }
});

// search for Recipes

router.post("/all/search", async (req, res) => {
  try {
    let recipes = await Recipe.find();
    if (req.body.title) {
      recipes = recipes.filter(
        (recipe) =>
          recipe.title.includes(req.body.title) ||
          recipe.desc.includes(req.body.title)
      );
    }
    if (req.body.cuisine) {
      recipes = recipes.filter((recipe) => recipe.cuisine === req.body.cuisine);
    }
    if (req.body.diet) {
      recipes = recipes.filter((recipe) => recipe.diet === req.body.diet);
    }
    if (req.body.maxTime) {
      recipes = recipes.filter(
        (recipe) => recipe.preparationTime <= req.body.maxTime
      );
    }
    if (req.body.maxCalories) {
      recipes = recipes.filter(
        (recipe) => recipe.calories <= req.body.maxCalories
      );
    }
    if (req.body.minCalories) {
      recipes = recipes.filter(
        (recipe) => recipe.calories >= req.body.minCalories
      );
    }
    if (req.body.Intolerances) {
      req.body.Intolerances.forEach((intolerance) => {
        recipes = recipes.filter(
          (recipe) => !recipe.intolerances.includes(intolerance)
        );
      });
    }
    recipes.slice(0, 40);
    const recipesFinal = await Promise.all(
      recipes.map(async (recipe) => {
        let newRecipe = recipe;
        const currentUser = await User.findById(recipe.userId);
        newRecipe.userId = currentUser?.username;
        return newRecipe;
      })
    );
    res.status(200).json(recipesFinal);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
