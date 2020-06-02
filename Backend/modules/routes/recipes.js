const express = require("express");
const router = express.Router();
const search_utils= require("../utils/search_recipes");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


router.get("/recipeInfo", async (req, res, next) => {
    try {
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
      
      res.send({ data: recipe.data });
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




module.exports = router;
