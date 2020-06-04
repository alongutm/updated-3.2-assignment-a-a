const express = require("express");
const router = express.Router();
const DBUtils = require("../utils/DBUtils");
const axios = require("axios");
const recipeUtils = require("../utils/recipeUtils");


router.get("/profileRecipeInfo", async (req, res, next) => {
    try {
    // get the user's username
    let username = await DBUtils.execQuery(`SELECT username FROM users WHERE user_id='${req.session.id}'`);
    username= username[0].username;
    // get isFavorite value
    const favorite = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE recipe_id='${req.query.recipe_id}' and username ='${username}'`);
    let isFavorite = (favorite.length > 0);
    // get wasSeen value
    const seen = await DBUtils.execQuery(`SELECT * FROM seenRecipes WHERE username='${username}' and recipe_id='${req.query.recipe_id}'`);
    let wasSeen = (favorite.length > 0);
    // getRecipe info
    let recipeInfo = await recipeUtils.getRecipeInfo(req.query.recipe_id);
    recipeInfo.seen = wasSeen;
    recipeInfo.isFavorite = isFavorite;
    
    res.status(200).send({ recipeInfo });
} catch (error) {
next(error);
}
});


router.get("/MyRecipes", async (req, res, next) => {
    try {
      // get the user's username
      let username = await DBUtils.execQuery(`SELECT username FROM users WHERE user_id= cast('${req.session.id}' as UNIQUEIDENTIFIER)`);
      username= username[0].username;
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
      username= username[0].username;
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
      let recipes;
      let instructionsInclueded = false;
      while (!instructionsInclueded) {
        instructionsInclueded = true;
        recipes = await recipeUtils.getTreeRandomRecipes();
        let recipesArray = recipes.data.recipes;
  
        for (var i = 0; i < 3; i++) {
          // use i as an array index
          if (recipesArray[i].instructions == null || recipesArray[i].instructions.length == 0)
            instructionsInclueded = false;
        }
      }
      res.send(recipes.data.recipes);
  
    }
    catch (error) {
      next(error);
    }
  });


module.exports = router;