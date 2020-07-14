const express = require("express");
const router = express.Router();
const DBUtils = require("../utils/DBUtils");
const axios = require("axios");
const recipeUtils = require("../utils/recipeUtils");

router.get("/myRecipes", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myRecipes = await DBUtils.execQuery(
      `SELECT * FROM myRecipes WHERE username='${username}'`
    );
    res.status(200).send(myRecipes);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/myFavorites", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myFavorites = await DBUtils.execQuery(
      `SELECT recipe_id FROM favoriteRecipes WHERE username='${username}'`
    );
    let ids = [];
    myFavorites.map((recipe) => ids.push(recipe.recipe_id));

    let fullRecipes = await Promise.all(
      ids.map((id) => recipeUtils.getRecipeNeededInfoByID(id))
    );

    //.log(fullRecipes);
    res.status(200).send({ data: fullRecipes });
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
});

router.get("/isFavorite", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myFavorites = await DBUtils.execQuery(
      `SELECT recipe_id FROM favoriteRecipes WHERE username='${username}' AND recipe_id='${req.query.recipe_id}'`
    );

    res.status(200).send({ data: myFavorites });
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
});

router.post("/addFavorite", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myFavorites = await DBUtils.execQuery(
      `SELECT * FROM favoriteRecipes WHERE username='${username}' and recipe_id='${req.body.recipe_id}'`
    );

    if (myFavorites.length == 0) {
      await DBUtils.execQuery(
        `INSERT INTO favoriteRecipes VALUES ('${username}','${req.body.recipe_id}')`
      );
    }
    res
      .status(200)
      .send({ message: "Recipe was added to favorites", success: true });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/randomRecipes", async (req, res, next) => {
  try {
    let recipes = await recipeUtils.getRandomRecipes();
    //add seen and favorite values to recipes info
    recipes = await recipeUtils.getSeenAndFavoriteInfo(recipes, req);
    res.status(200).send(recipes);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
* search calls will get here - 
* this will handle them, and send them to spooncular.
* the orginal search-call to the spooncular returning partial info about the recpies,
* so another call will be made with the ID's of the recpies using 'Promise.all', in order to return
* full recpies, and get them all in once
 (and not wait for each of them to return before sendind the next one).
*/
router.get("/search/query/:query/amount/:number", async (req, res, next) => {
  try {
    //search recipes from spooncular API according to the search query and other values (like kind of cuisine etc.)
    let recipesObj = await recipeUtils.searchRecipesByQuery(req);
    let recipesArray = recipesObj.data.results;
    //ask for full recipes information from the API (with the get Recipe by {id})
    var recipes = await recipeUtils.getRecipesArrayWithNeededInfo(recipesArray);
    //add isSeen and isFavorite fields to each recipe.
    recipes = await recipeUtils.getSeenAndFavoriteInfo(recipes, req);
    res.status(200).send(recipes);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/myFamilyRecipes", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    const myFamilyRecipes = await DBUtils.execQuery(
      `SELECT * FROM myFamilyRecipes WHERE username='${username}'`
    );
    res.status(200).send(myFamilyRecipes);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/lastWatched", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    let lastWatched = await DBUtils.execQuery(
      `SELECT * FROM lastWatchedRecipes WHERE username='${username}'`
    );
    if (lastWatched.length < 1) {
      lastWatched = await recipeUtils.getRandomRecipes();
    } else {
      let fullRecipes = [];
      fullRecipes[0] = await recipeUtils.getRecipeNeededInfoByID(
        lastWatched[0].recipe_id_1
      );
      fullRecipes[1] = await recipeUtils.getRecipeNeededInfoByID(
        lastWatched[0].recipe_id_2
      );
      fullRecipes[2] = await recipeUtils.getRecipeNeededInfoByID(
        lastWatched[0].recipe_id_3
      );
      lastWatched = fullRecipes;
    }
    res.status(200).send(lastWatched);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/updateLastWatched", async (req, res, next) => {
  try {
    // get the user's username
    let username = await DBUtils.execQuery(
      `SELECT username FROM users WHERE user_id= cast('${req.user_id}' as UNIQUEIDENTIFIER)`
    );
    username = username[0].username;
    // get my recipes from the myRecipes table
    const lastWatched = await DBUtils.execQuery(
      `SELECT * FROM lastWatchedRecipes WHERE username='${username}'`
    );
    let recipe_1, recipe_2, recipe_3;
    if (lastWatched.length == 0) {
      // first watched recipe
      recipe_1 = req.body.recipe_id;
      recipe_2 = 12234;
      recipe_3 = 5678;
      await DBUtils.execQuery(
        `INSERT INTO lastWatchedRecipes VALUES('${username}','${recipe_1}','${recipe_2}','${recipe_3}')`
      );
    } else {
      recipe_1 = lastWatched[0].recipe_id_1;
      recipe_2 = lastWatched[0].recipe_id_2;
      recipe_3 = lastWatched[0].recipe_id_3;
      if (req.query.recipe_id == recipe_1) {
        // do nothing
      } else if (req.query.recipe_id == recipe_2) {
        recipe_2 = recipe_1;
        recipe_1 = parseInt(req.body.recipe_id);
      } else {
        recipe_3 = recipe_2;
        recipe_2 = recipe_1;
        recipe_1 = parseInt(req.body.recipe_id);
      }

      await DBUtils.execQuery(
        `UPDATE lastWatchedRecipes SET recipe_id_1='${recipe_1}',recipe_id_2='${recipe_2}',recipe_id_3='${recipe_3}' WHERE username= '${username}'`
      );
    }
    console.log(
      await DBUtils.execQuery(
        `SELECT * FROM lastWatchedRecipes WHERE username='${username}'`
      )
    );
    res
      .status(200)
      .send({ message: "Last watched updates successfully", success: true });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
