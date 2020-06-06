const express = require("express");
const router = express.Router();
const DBUtils = require("../utils/DBUtils");
const axios = require("axios");
const recipeUtils = require("../utils/recipeUtils");

router.get("/MyRecipes", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(`SELECT username FROM users WHERE user_id= cast('${req.session.id}' as UNIQUEIDENTIFIER)`);
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myRecipes = await DBUtils.execQuery(`SELECT * FROM myRecipes WHERE username='${username}'`);
    res.send((myRecipes));
  }
  catch (error) {
    next(error);
  }
});


router.get("/MyFavorites", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(`SELECT username FROM users WHERE user_id= cast('${req.session.id}' as UNIQUEIDENTIFIER)`);
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myFavorites = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE username='${username}'`);
    res.send((myFavorites));
  }
  catch (error) {
    next(error);
  }
});

router.get("/randomRecipes", async (req, res, next) => {
  try {
    let recipes = await recipeUtils.getRandomRecipes();
    //add seen and favorite values to recipes info
    recipes = await recipeUtils.getSeenAndFavoriteInfo(recipes,req);
    res.status(200).send(recipes);
  }
  catch (error) {
    next(error);
  }
});


/**
* search calls will get here - 
* this will handle them, and send them to spooncular.
* the orginal search-call to the spooncular returning partial info about the recpies,
* so another call will be made with the ID's of the recpies, in order to return
* full recpies.
*/
router.get("/search/query/:query/amount/:number", async (req, res, next) => {
  try {
    //search recipes from spooncular API according to the search query and other values (like kind of cuisine etc.)
    let recipesObj = await recipeUtils.searchRecipesByQuery(req);
    let recipesArray = recipesObj.data.results;
    //ask for full recipes information from the API (with the get Recipe by {id})
    var recipes = await recipeUtils.getRecipesArrayWithNeededInfo(recipesArray);
    recipes = await recipeUtils.getSeenAndFavoriteInfo(recipes,req);

  }
  catch (error) {
    res.status(404).send(error);
  }

  res.send({ recipes });
});


module.exports = router;