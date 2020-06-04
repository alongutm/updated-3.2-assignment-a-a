
-- CREATE TABLE [dbo].[myRecipes](

--     [username] [varchar](300) NOT NULL,
--     [recipe_id] [varchar](30) not null default NEWID(),
--     [recipeName] [varchar](30) NOT NULL,
--     [image] [varchar](300) NOT NULL,
--     [coockingTime] [varchar](30) NOT NULL,
--     [numberOfLikes] [int] NOT NULL,
--     [isVegan] [varchar](30) NOT NULL,
--     [isVegeterian] [varchar](30) NOT NULL,
--     [isGlutenFree] [varchar](30) NOT NULL,
--     [IngredientList] [varchar](500) NOT NULL,
--     [Instructions] [varchar](500) NOT NULL,
--     [MealsQuantity] [int] NOT NULL,
--     PRIMARY KEY (username, recipe_id)
-- )

-- INSERT INTO [dbo].[myRecipes] VALUES
-- ("AlonGutman", default, "Green Curry Cod","https://spoonacular.com/recipeImages/2457-556x370.jpg" , 55,3,"false",
--  ),


SELECT * from myRecipes;