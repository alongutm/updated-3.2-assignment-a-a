const express = require("express");
const router = express.Router();
const axios = require("axios");
const DBUtils = require("../utils/DBUtils");
const recipeUtils = require("../utils/recipeUtils");



router.get("/recipeInfo", async (req, res, next) => {
  try {
    let fullInfo = await recipeUtils.getRecipeFullInfoByID(req.query.recipe_id);
    res.status(200).send({ fullInfo });
  } catch (error) {
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
  }
  catch (error) {
    next(error);
  }

  res.send({ recipes });
});


router.get("/randomRecipes", async (req, res, next) => {
  try {
    let recipes = await recipeUtils.getRandomRecipes();
    res.status(200).send(recipes);
  }
  catch (error) {
    next(error);
  }
});


module.exports = router;
