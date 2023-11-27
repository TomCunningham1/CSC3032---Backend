CREATE TABLE IF NOT EXISTS UsersPlaythrough ( 
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    PlaythroughId Integer NOT NULL,
    BestScore INT,
    AverageScore INT
); 