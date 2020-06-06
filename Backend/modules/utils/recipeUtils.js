const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DBUtils = require("../utils/DBUtils");



// spooncular settings
const recipes_api_url = "https://api.spoonacular.com/recipes";



/*
this function iterating over the basic recipes that is inside recipesArray
and ask the spooncular for the full recipes,
then it sends full recipes back after taking only the specific info we need.
*/
async function getRecipesArrayWithNeededInfo(recipesArray) {
  var recipesId = recipesArray.map(a => a.id);
  let promises = [];
  recipesId.map((id) =>
   promises.push(axios.get(`${api_domain}/${id}/information`, {
    params: {
      apiKey: process.env.spooncular_apiKey
    }
  })));
  let info_response = await Promise.all(promises);
  let recipes = [];
  // the "for-of" loop is aysnc`
  for (let fullRecipe of info_response) {
    let fullInfo = {
      recipe_id: fullRecipe.data.id,
      recipeName: fullRecipe.data.title,
      image: fullRecipe.data.image,
      coockingTime: fullRecipe.data.readyInMinutes,
      numberOfLikes: fullRecipe.data.aggregateLikes,
      isVegan: fullRecipe.data.vegan,
      isVegeterian: fullRecipe.data.vegetarian,
      isGlutenFree: fullRecipe.data.glutenFree,
      IngredientList: fullRecipe.data.extendedIngredients.map(function (obj) {
        return obj.name;
      }),
      instructions: fullRecipe.data.instructions,
      MealsQuantity: fullRecipe.data.servings,
      //seen: false,
      //isFavorite: false 
    }
    recipes.push(fullInfo);
  }

  return recipes;
}



function getRecipeFullInfoByID(id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

async function getRandomRecipes() {
  let recipes;
  recipes = await getTreeRandomRecipes();
  let recipesArray = recipes.data.recipes;
  let treeRecipesNeededInfo = await getRecipesArrayWithNeededInfo(recipes.data.recipes);
  return treeRecipesNeededInfo;
}


function getTreeRandomRecipes() {
  return axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      apiKey: process.env.spooncular_apiKey,
      instructionsRequired: true
    }
  });
}

async function getRecipeNeededInfoByID(id) {
  // get recipe's information
  const recipe = await getRecipeFullInfoByID(id);
  // build recipe's object
  let info = {
    recipe_id: recipe.data.id,
    recipeName: recipe.data.title,
    image: recipe.data.image,
    coockingTime: recipe.data.readyInMinutes,
    numberOfLikes: recipe.data.aggregateLikes,
    instructions: recipe.data.instructions,
    isVegan: recipe.data.vegan,
    isVegeterian: recipe.data.vegetarian,
    isGlutenFree: recipe.data.glutenFree,
    IngredientList: recipe.data.extendedIngredients.map(function (obj) {
      return obj.name;
    }),
    MealsQuantity: recipe.data.servings,
  }
  return info;
}



function searchRecipesByQuery(req) {
  //set default number = 5 
  var params = req.params;
  //sending the correct request to spooncular
  return axios.get(`${api_domain}/search`, {
    params: {
      apiKey: process.env.spooncular_apiKey,
      query: params.query,
      number: params.number,
      instructionsRequired: true,
      ...(params.diet ? { diet: params.diet } : {}),
      ...(params.cuisine ? { cuisine: params.cuisine } : {}),
      ...(params.intolerances ? { intolerances: params.intolerances } : {})
    }
  });
}


async function getSeenAndFavoriteInfo(recipes,req) {
  let username = await DBUtils.execQuery(`SELECT username FROM users WHERE user_id='${req.session.id}'`);
  username = username[0].username;
  let newRecipes = [];
  for (let recipe of recipes) {
    // get isFavorite value
    const favorite = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE recipe_id='${recipe.recipe_id}' and username ='${username}'`);
    let isFavorite = (favorite.length > 0);
    // get wasSeen value
    const seen = await DBUtils.execQuery(`SELECT * FROM seenRecipes WHERE username='${username}' and recipe_id='${recipe.recipe_id}'`);
    let wasSeen = (favorite.length > 0);
    // getRecipe info
    recipe["isSeen"] = wasSeen;
    recipe["isFavorite"] = isFavorite;
    newRecipes.push(recipe);
  }

  return newRecipes;
}

exports.getRecipesArrayWithNeededInfo = getRecipesArrayWithNeededInfo;
exports.getRecipeNeededInfoByID = getRecipeNeededInfoByID;
exports.searchRecipesByQuery = searchRecipesByQuery;
exports.getTreeRandomRecipes = getTreeRandomRecipes;
exports.getRandomRecipes = getRandomRecipes;
exports.getSeenAndFavoriteInfo = getSeenAndFavoriteInfo;
