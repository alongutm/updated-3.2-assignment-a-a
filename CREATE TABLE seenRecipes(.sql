DROP TABLE seenRecipes;

CREATE TABLE seenRecipes(

    [username] [varchar](300) NOT NULL,
    [recipe_id] int not null,
    PRIMARY KEY (username, recipe_id)

)

select * from seenRecipes;