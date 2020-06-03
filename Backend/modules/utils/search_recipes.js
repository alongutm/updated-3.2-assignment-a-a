const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



// spooncular settings
const recipes_api_url= "https://api.spoonacular.com/recipes";


// add methods here !

/*
this function iterating over the basic recipes that is inside recipesArray
and ask the spooncular for the full recipes,
then it sends full recipes back
*/
async function searchRecieps(recipesArray){
    var recipes = [];
    // the "for-of" loop is aysnc`
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
 
  return recipes;
}


function getRecipeInfo(id) {
    return axios.get(`${api_domain}/${id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey
      }
    });
  }
  
  function searchRecipeInfo(req) {
    //set default number = 5 
    var query =  req.query;
    if(query.number == null || (query.number != 10 && query.number != 15)){
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





  exports.searchRecieps= searchRecieps;
  exports.getRecipeInfo= getRecipeInfo;
  exports.searchRecipeInfo= searchRecipeInfo;
