const express = require("express");
const router = express.Router();
const search_utils = require("../utils/search_recipes");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DBUtils = require("../utils/DBUtils");
const recipeUtils = require("../utils/search_recipes");



router.get("/recipeInfo", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(`SELECT username FROM favoriteRecipes WHERE user_id='${req.session.id}'`);
    // get isFavorite value
    const favorite = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE recipe_id='${req.query.recipe_id}' and username ='${username}'`);
    let isFavorite = (favorite.length > 0);
    // get wasSeen value
    const seen = await DBUtils.execQuery(`SELECT * FROM seenRecipes WHERE username='${username}' and recipe_id='${req.query.recipe_id}'`);
    let wasSeen = (favorite.length > 0);
    // get recipe's information
    const recipe = await recipeUtils.getRecipeInfo(req.query.recipe_id);
    // build recipe's object
    let fullInfo = {
      recipe_id: recipe.data.id,
      recipeName: recipe.data.title,
      image: recipe.data.image,
      coockingTime: recipe.data.readyInMinutes,
      numberOfLikes: recipe.data.aggregateLikes,
      isVegan: recipe.data.vegan,
      isVegeterian: recipe.data.vegetarian,
      isGlutenFree: recipe.data.glutenFree,
      IngredientList: recipe.data.extendedIngredients.map(function (obj) {
        return obj.name;
      }),
      Instructions: recipe.data.Instructions,
      MealsQuantity: recipe.data.servings,
      seen: wasSeen,
      isFavorite: isFavorite
    }
    res.status(200).send({ fullInfo });

  } catch (error) {
    next(error);
  }
});


router.get("/search", async (req, res, next) => {
  try {
    //search recipes from spooncular API according to the search query and other values (like kind of cuisine etc.)
    let recipesObj = await recipeUtils.searchRecipeInfo(req);
    let recipesArray = recipesObj.data.results;
    //ask for full recipes information from the API (with the get Recipe by {id})
    var recipes = await recipeUtils.searchRecieps(recipesArray);
  }
  catch (error) {
    next(error);
  }

  res.send({ recipes });
});

router.get("/MyRecipes", async (req, res, next) => {
  try {
    console.log(req.headers.cookie.session);
    console.log(req.session.cookieName);
    console.log(req.session);
    console.log(req.id);

    // get the user's username
    let username = await DBUtils.execQuery(`SELECT username FROM users WHERE user_id= cast('${req.session.id}' as UNIQUEIDENTIFIER)`);
    // get my recipes from the myRecipes table
    const myRecipes = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE username='${username}'`);
    res.send((myRecipes));
  }
  catch (error) {
    next(error);
  }
});



module.exports = router;
