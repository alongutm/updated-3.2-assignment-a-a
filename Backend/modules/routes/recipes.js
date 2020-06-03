const express = require("express");
const router = express.Router();
const search_utils = require("../utils/search_recipes");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DBUtils = require("../utils/DBUtils");



router.get("/recipeInfo", async (req, res, next) => {
    try {
<<<<<<< HEAD
      const recipe = await getRecipeInfo(req.query.recipe_id);
      let fullInfo= {
        recipe_id: recipe.data.id,
        recipeName: recipe.data.title,
        image: recipe.data.image,
        coockingTime: recipe.data.readyInMinutes,
        numberOfLikes: recipe.data.aggregateLikes,
        isVegan: recipe.data.vegan,
        isVegeterian: recipe.data.vegetarian ,
        isGlutenFree: recipe.data.glutenFree,
        IngredientList: recipe.data.extendedIngredients.map(function(obj){
            return obj.name;
        }),
        Instructions: recipe.data.summary,
        MealsQuantity: recipe.data.servings,
        seen: false,
        isFavorite: false 
      }
      
      res.send({ fullInfo });
=======
        // get seen & isFavorite
        const favorite = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE user_id='${req.session.id}' and recipe_id='${req.query.recipe_id}'`);
        let isFavorite= (favorite.length>0);

        const recipe = await getRecipeInfo(req.query.recipe_id);
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
            Instructions: recipe.data.summary,
            MealsQuantity: recipe.data.servings,
            isFavorite: isFavorite
        }

        res.send({ data: fullInfo });
>>>>>>> 10d1a408ec9f2c772cd9e4afb0e395b7c0b40967
    } catch (error) {
        next(error);
    }
});

<<<<<<< HEAD
  router.get("/search", async (req, res, next) => {
    try {
      var recipesObj = await searchRecipeInfo(req);
      var recipesArray = recipesObj.data.results;
      var recipes = [];
      // the "for-of" loop is aysnc
      for(let recipe of recipesArray){
        var fullRecipe = await getRecipeInfo(recipe.id);
        let fullInfo= {
          recipe_id: fullRecipe.data.id,
          recipeName: fullRecipe.data.title,
          image: fullRecipe.data.image,
          coockingTime: fullRecipe.data.readyInMinutes,
          numberOfLikes: fullRecipe.data.aggregateLikes,
          isVegan: fullRecipe.data.vegan,
          isVegeterian: fullRecipe.data.vegetarian ,
          isGlutenFree: fullRecipe.data.glutenFree,
          IngredientList: fullRecipe.data.extendedIngredients.map(function(obj){
              return obj.name;
          }),
          Instructions: fullRecipe.data.summary,
          MealsQuantity: fullRecipe.data.servings,
          seen: false,
          isFavorite: false 
        }
        recipes.push(fullInfo);
      }


    } catch (error) {
      next(error);
    }
    res.send({ recipes });

  });

  function getRecipeInfo(id) {
=======
function getRecipeInfo(id) {
>>>>>>> 10d1a408ec9f2c772cd9e4afb0e395b7c0b40967
    return axios.get(`${api_domain}/${id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey
      }
    });
  }

  function searchRecipeInfo(req) {
    var query =  req.query;
    var paramNum = query.number;
    if(paramNum == null){
      req.query.number = 5;
      paramNum = 5;
    } 
    
    
    return axios.get(`${api_domain}/search`, {
      params: {
        apiKey: process.env.spooncular_apiKey,
        query: query.query,
        number: paramNum,
        ...(query.diet ? {diet: query.diet} : {}),
        ...(query.cuisine ? {cuisine: query.cuisine} : {}),
        ...(query.intolerances ? {intolerances: query.intolerances} : {})
      }
    });
  }


module.exports = router;
