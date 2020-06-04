-- drop TABLE favoriteRecipes;

CREATE TABLE favoriteRecipes(
    [username] [varchar](30) NOT NULL,
    [recipe_id] int not null,
    PRIMARY KEY (username, recipe_id)
)

select * from favoriteRecipes;