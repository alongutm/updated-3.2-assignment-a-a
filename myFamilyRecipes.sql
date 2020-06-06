
drop TABLE myFamilyRecipes;

CREATE TABLE [dbo].[myFamilyRecipes](

    [username] [varchar](300) NOT NULL,
    [recipeName] [varchar](300) NOT NULL,
    [author] [varchar](30) NOT NULL,
    [occasion][varchar](30) NOT NULL,
    [image] [varchar](300) NOT NULL,
    [coockingTime] [varchar](30) NOT NULL,
    [numberOfLikes] [int] NOT NULL,
    [isVegan] [bit] NOT NULL,
    [isVegeterian] [bit] NOT NULL,
    [isGlutenFree] [bit] NOT NULL,
    [IngredientList] [varchar](500) NOT NULL,
    [Instructions] [varchar](8000) NOT NULL,
    [MealsQuantity] [int] NOT NULL,
    PRIMARY KEY (username, recipeName)
)

INSERT into myFamilyRecipes values
('AmitShakarchy', 'Moroccan Fish', 'Grandma Miriam Shukrun', 'Friday Kidush','https://res.cloudinary.com/dtc8lczrf/image/upload/v1591428464/WhatsApp_Image_2020-06-05_at_16.22.41_o0swtp.jpg',20,3000,'false','false','true',
'sweet paprica,garlic,olive oil,red hot pepper,fresh cilantro,hot paprica,salt,pepper,lemon,fish of choice',
'Padd a large pan with a cover with cilantro, lemon slices and red pepper. Add garlic. Mix papricas, salt, pepper and olive oil i a small plate.
Deep the fish filet inside the mixture, and arrange it on the pan. Add 1/2 cup of water and cook for 25 minutes.',6),

('AmitShakarchy', 'Sweet chocolate buns', 'Grandma Nina Shakarchy','every single day!','https://res.cloudinary.com/dtc8lczrf/image/upload/v1591358469/WhatsApp_Image_2019-11-21_at_11.41.35_zqic04.jpg',
60,9000,'false','true','false','flour,sugar,yeast,salt,eggs,milk,chocolate chunks',
'Mix sugar and eggs. Add flour, salt, and yeast. add milk and mix until dough comes together. 
Cover the dough and let sit for 40 minutes. creat small buns and shove a chocolatre chunk in it. 
Brush the buns with egg and sprinkle sugar on top. Bake for 20 minutes.',30),

('AmitShakarchy','Sfinge doughnuts','Grandma Nina Shakarchy','Hanukkah',
 'https://res.cloudinary.com/dtc8lczrf/image/upload/v1591358555/vr3b1jjl__w643h517q95_ambojh.jpg',
60,1000000,'true','true','false',
'2 cups of cold water,1 spoon of fresh yeast,1 kg of flour,1 spoon of sugar,a pinch of salt,1 liter of oil',
'Mix flour, water, yeast, salt, sugar and water until dough comes together. Cover the dough and let sit for 40 minutes.
Fill a medium bowl with water. Dip your hands in and then break off a fistful of the batter, and force your thumb through the center of the mass. It may seem awkward because the dough is so soft and sticky but this is a key characteristic of the spongy sfinge. 
Gently use both hands to pull the dough into a rough doughnut shape. Fry the doughnuts until they are golden brown on both sides. 
Top woth sugar and serve', 20),

('AlonGutman','Gefilte Fish', 'Grandma', 'passover', 'https://res.cloudinary.com/dtc8lczrf/image/upload/v1591356846/classic-gefilte-fish_ly2d1p.jpg',
70,4,'false','false','false',
'filleted and grounded fish,cold water,salt,onion,carrots,sugar,eggs,matzah',
'1. Place the reserved bones, skin, and fish heads in a wide, very large saucepan with a cover. Add the water and 2 teaspoons of the salt and bring to a boil. Remove the foam that accumulates.
2. Slice 1 onion in rounds and add along with 3 of the carrots. Add the sugar and bring to a boil. Cover and simmer for about 20 minutes while the fish mixture is being prepared.
3. Place the ground fish in a bowl. In a food processor finely chop the remaining onions, the remaining carrot, and the parsnip; or mince them by hand. Add the chopped vegetables to the ground fish.
4. Add the eggs, one at a time, the remaining teaspoon of salt, pepper, and the cold water, and mix thoroughly. Stir in enough matzah meal to make a light, soft mixture into oval shapes, about 3 inches long. Take the last fish head and stuff the cavity with the ground fish mixture.
5. Using a slotted spoon carefully remove the gefilte fish and arrange on a platter. Strain some of the stock over the fish, saving the rest in a bowl.
6. Slice the cooked carrots into rounds cut on a diagonal about 1/4 inch thick. Place a carrot round on top of each gefilte fish patty. Put the fish head in the center and decorate the eyes with carrots. Chill until ready to serve. Serve with a sprig of parsley and horseradish.',
6), 

('AlonGutman','The Perfect Omlette!','Grandma', 'everyday', 'https://res.cloudinary.com/dtc8lczrf/image/upload/v1591357242/grandmaspies_nsbjgc.jpg',
15,30,'false','true','true','2 eggs,2 tablespoons of milk,1 tablespoon of butter,Salt and pepper,mushrooms,cheese',
'Crack the eggs into a glass mixing bowl and beat them until they turn a pale yellow color. Heat a pan and add butter into it.
Add the milk to the eggs and season to taste with salt and white pepper. Then, grab your whisk and whisk like crazy.When the butter in the pan is hot enough to make a drop of water hiss, pour in the eggs. Dont stir! Let the eggs cook for up to a minute or until the bottom starts to set.
Now gently flip the egg pancake over, using your spatula to ease it over if necessary. Cook for another few seconds, or until there is no uncooked egg left.
Add mushrooms and cheese, and fleep both sides of the omlette to the center. Serve.', 2 ),

('AlonGutman','Ice cream on chips!', 'My brother', 'on the first day of my diet','https://res.cloudinary.com/dtc8lczrf/image/upload/v1591358037/6cd08488-d82b-47d0-83bf-06b9aae4768f_nwum5k.jpg',
3,1,'false','true','true','French fries from the closest Mcdonalds,Ben&Jerrys',
'Take a scoop of your favorite ice cream and just put it on top of tour french fries. DONE!',1);



select * from myFamilyRecipes;