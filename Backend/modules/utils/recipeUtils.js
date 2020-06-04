const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



// spooncular settings
const recipes_api_url= "https://api.spoonacular.com/recipes";


// add methods here !

/*
this function iterating over the basic recipes that is inside recipesArray
and ask the spooncular for the full recipes,
then it sends full recipes back after taking only the specific info we need.
*/
async function getRecipesArrayWithNeededInfo(recipesArray){
    var recipes = [];
    // the "for-of" loop is aysnc`
 for(let recipe of recipesArray){
    var fullRecipe = await getRecipeNeededInfoByID(recipe.id);
    let fullInfo= {
      recipe_id: fullRecipe.recipe_id,
      recipeName: fullRecipe.recipeName,
      image: fullRecipe.image,
      coockingTime: fullRecipe.coockingTime,
      numberOfLikes: fullRecipe.numberOfLikes,
      isVegan: fullRecipe.isVegan,
      isVegeterian: fullRecipe.isVegeterian ,
      isGlutenFree: fullRecipe.isGlutenFree,
      IngredientList: fullRecipe.IngredientList,
      instructions: fullRecipe.instructions,
      MealsQuantity: fullRecipe.MealsQuantity,
      seen: false,
      isFavorite: false 
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







  function getTreeRandomRecipes() {
    return axios.get(`${api_domain}/random`, {
      params: {
        number: 3,
        apiKey: process.env.spooncular_apiKey
      }
    });
  }
  
  function searchRecipesByQuery(req) {
    //set default number = 5 
    var query =  req.query;
    if(query.number == null || (query.number != 10 && query.number != 15)){
      paramNum = 5;
    } 
    
   //sending the correct request to spooncular
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



  exports.getRecipesArrayWithNeededInfo= getRecipesArrayWithNeededInfo;
  exports.getRecipeNeededInfoByID= getRecipeNeededInfoByID;
  exports.searchRecipesByQuery= searchRecipesByQuery;
  exports.getTreeRandomRecipes = getTreeRandomRecipes;
