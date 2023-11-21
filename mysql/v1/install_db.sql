CREATE DATABASE IF NOT EXISTS team11_dev;
CREATE DATABASE IF NOT EXISTS team11_prod;

-- GRANT ALL PRIVILEGES ON team11_dev.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON team11_dev.* TO 'root'@'192.162.16.2';
-- GRANT ALL PRIVILEGES ON team11_prod.* TO 'root'@'localhost';
-- GRANT ALL PRIVILEGES ON team11_prod.* TO 'root'@'192.162.16.2';

USE team11_dev;

CREATE TABLE Users ( 
    Username VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL, 
    LastName VARCHAR(255) NOT NULL,  
    Email VARCHAR(255) NOT NULL UNIQUE, 
    RegDate TIMESTAMP,
    BestScore INT,
    AverageScore INT
); 

CREATE TABLE Playthrough (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    Description VARCHAR(255)
);

CREATE TABLE Attempt (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255),
    PlaythroughId INT(6) UNSIGNED,
    Score Int
);

INSERT INTO `Users` ( `Username`, `FirstName`, `LastName`, `Email`, `RegDate`) VALUES 
('johndoe', 'John', 'Doe', 'john.doe@sqltest.net', CURDATE()); 
