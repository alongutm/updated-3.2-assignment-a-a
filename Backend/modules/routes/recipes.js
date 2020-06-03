const express = require("express");
const router = express.Router();
const search_utils = require("../utils/search_recipes");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DBUtils = require("../utils/DBUtils");



router.get("/recipeInfo", async (req, res, next) => {
    try{ 
    // get seen & isFavorite
        const favorite = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE user_id='${req.session.id}' and recipe_id='${req.query.recipe_id}'`);
        let isFavorite= (favorite.length>0);
        
        const seen = await DBUtils.execQuery(`SELECT * FROM seenRecipes WHERE user_id='${req.session.id}' and recipe_id='${req.query.recipe_id}'`);
        let wasSeen= (favorite.length>0);

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
        seen: wasSeen,
        isFavorite: isFavorite 
      }
      
      res.send({ fullInfo });
    } catch (error) {
        next(error);
    }
});

function getRecipeInfo(id) {
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
