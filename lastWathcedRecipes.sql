
CREATE TABLE [dbo].[lastWatchedRecipes](
    [username] [varchar](300) NOT NULL,
    [recipe_id_1] int NOT NULL,
    [recipe_id_2] int NOT NULL,
    [recipe_id_3] int NOT NULL,
    PRIMARY KEY (username)
)



INSERT into lastWatchedRecipes values
('AlonGutman',123,456,789);
select * from lastWatchedRecipes;