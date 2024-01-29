CREATE DATABASE IF NOT EXISTS team11_non_prod_db;

USE team11_non_prod_db;

CREATE TABLE IF NOT EXISTS Scenario (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255)
);
 
CREATE TABLE IF NOT EXISTS Attempt (
    Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255),
    ScenarioId INT(6) UNSIGNED,
    Score Int,
    NumberOfQuestions int,
    NumberOfAnsweredQuestions int,
    CorrectAnswers int,
    WrongAnswers int,
    HintsUsed int,
    FiftyFiftyUsed int,
    CONSTRAINT fk_scenario FOREIGN KEY (ScenarioId) REFERENCES Scenario(Id)
    );