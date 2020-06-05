-- drop TABLE myRecipes;

-- CREATE TABLE [dbo].[myRecipes](

--     [username] [varchar](300) NOT NULL,
--     [recipe_id] [varchar](300) not null default NEWID(),
--     [recipeName] [varchar](300) NOT NULL,
--     [image] [varchar](300) NOT NULL,
--     [coockingTime] [varchar](30) NOT NULL,
--     [numberOfLikes] [int] NOT NULL,
--     [isVegan] [bit] NOT NULL,
--     [isVegeterian] [bit] NOT NULL,
--     [isGlutenFree] [bit] NOT NULL,
--     [IngredientList] [varchar](500) NOT NULL,
--     [Instructions] [varchar](500) NOT NULL,
--     [MealsQuantity] [int] NOT NULL,
--     PRIMARY KEY (username, recipe_id)
-- )

INSERT INTO [dbo].[myRecipes] VALUES
('AlonGutman', default, 'Green Curry Cod','https://spoonacular.com/recipeImages/2457-556x370.jpg' , 55,3,'false','true',
'true','coconut cream,cod,dried dill weed,garlic,green bell pepper,bbq sauce,leek,olive oil,red onion,salt and pepper',
 'Mix it all togheter and shove into the oven for 25 minutes', 4),

 ('AlonGutman', default,'Pumpkin Muffins', 'https://spoonacular.com/recipeImages/24335-556x370.jpg', 30,10,'false','true', 
 'false', 'baking powder,baking soda,cinnamon,eggs,flour,pumpkin pie spice,salt,solid pack pumpkin,sugar,vegetable oil',
 'Mix all ingrediants and shove into the oven for 45 minutes',8),
('AmitShakarchy', default, 'Chocolate Coconut Almond Cheesecake','https://spoonacular.com/recipeImages/54324-556x370.jpg',
45, 280,'false','true','false', 
'almond extract,almonds,coconut,corn starch,cream cheese,cream of coconut,egg yolk,eggs,oreos,semisweet chocolate chips,sour cream,unsalted butter,vanilla extract',
'Mix all togheter and shove into the oven for 60 minutes', 8 ),

('AmitShakarchy', default, 'Coconut & Banana Pancake Cake','https://spoonacular.com/recipeImages/54327-556x370.jpg',
45, 75, 'false','true','true','bananas,coconut milk,coconut oil,eggs,fresh fruit,coconut flakes',
'Mix all ingrediants in a big bowl, cook the pankakes on a flat pan and pile them on a plate. Serve with fresh fruit and coconut flakes.',
6);

SELECT * from myRecipes;

