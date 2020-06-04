const express = require("express");
const router = express.Router();
const axios = require("axios");
const DBUtils = require("../utils/DBUtils");
const recipeUtils = require("../utils/recipeUtils");



router.get("/recipeInfo", async (req, res, next) => {
  try {
    let fullInfo = await recipeUtils.getRecipeInfo(req.query.recipe_id);
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




module.exports = router;
