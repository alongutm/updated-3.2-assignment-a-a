const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DBUtils = require("../utils/DBUtils");



// spooncular settings
const recipes_api_url = "https://api.spoonacular.com/recipes";


// add methods here !

/*
this function iterating over the basic recipes that is inside recipesArray
and ask the spooncular for the full recipes,
then it sends full recipes back after taking only the specific info we need.
*/
async function getRecipesArrayWithNeededInfo(recipesArray) {
  var recipes = [];
  // the "for-of" loop is aysnc`
  for (let recipe of recipesArray) {
    var fullRecipe = await getRecipeNeededInfoByID(recipe.id);
    let fullInfo = {
      recipe_id: fullRecipe.recipe_id,
      recipeName: fullRecipe.recipeName,
      image: fullRecipe.image,
      coockingTime: fullRecipe.coockingTime,
      numberOfLikes: fullRecipe.numberOfLikes,
      isVegan: fullRecipe.isVegan,
      isVegeterian: fullRecipe.isVegeterian,
      isGlutenFree: fullRecipe.isGlutenFree,
      IngredientList: fullRecipe.IngredientList,
      instructions: fullRecipe.instructions,
      MealsQuantity: fullRecipe.MealsQuantity,
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
  let instructionsInclueded = false;
  while (!instructionsInclueded) {
    instructionsInclueded = true;
    recipes = await getTreeRandomRecipes();
    let recipesArray = recipes.data.recipes;

    for (var i = 0; i < 3; i++) {
      // use i as an array index
      if (recipesArray[i].instructions == null || recipesArray[i].instructions.length == 0)
        instructionsInclueded = false;
    }
  }
  let treeRecipesNeededInfo = await getRecipesArrayWithNeededInfo(recipes.data.recipes);
  return treeRecipesNeededInfo;

}


function getTreeRandomRecipes() {
  return axios.get(`${api_domain}/random`, {
    params: {
      number: 3,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

async function getRecipeNeededInfoByID(id) {
  // get recipe's information
  const recipe = await getRecipeFullInfoByID
    (id);
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
  var query = req.query;
  let info = {params: {
    apiKey: process.env.spooncular_apiKey,
    query: query.query,
    number: query.number,
    ...(query.diet ? { diet: query.diet } : {}),
    ...(query.cuisine ? { cuisine: query.cuisine } : {}),
    ...(query.intolerances ? { intolerances: query.intolerances } : {})
  }}
  //sending the correct request to spooncular
  return axios.get(`${api_domain}/search`, {
    params: {
      apiKey: process.env.spooncular_apiKey,
      query: query.query,
      number: query.number,
      ...(query.diet ? { diet: query.diet } : {}),
      ...(query.cuisine ? { cuisine: query.cuisine } : {}),
      ...(query.intolerances ? { intolerances: query.intolerances } : {})
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
