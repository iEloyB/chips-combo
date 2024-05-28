-- Creación de las tablas
CREATE TABLE Color (
    co_id INT AUTO_INCREMENT PRIMARY KEY,
    co_hexadecimalColor VARCHAR(6) NOT NULL
);

CREATE TABLE Player (
    pl_id INT AUTO_INCREMENT PRIMARY KEY,
    pl_name VARCHAR(255) NOT NULL,
    pl_tag VARCHAR(50) NOT NULL,
    pl_iconId INT DEFAULT 1 NOT NULL,
    pl_xp INT DEFAULT 100 NOT NULL,
    pl_coins INT DEFAULT 0 NOT NULL,
    pl_email VARCHAR(255) UNIQUE NOT NULL,
    pl_pass VARCHAR(255) NOT NULL,
    pl_language VARCHAR(10) DEFAULT 'en_US' NOT NULL
);

CREATE TABLE Session (
    se_id INT AUTO_INCREMENT PRIMARY KEY,
    se_playerId INT,
    se_token VARCHAR(255) NOT NULL,
    se_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (se_playerId) REFERENCES Player(pl_id)
);

CREATE TABLE Queue (
    qu_id INT AUTO_INCREMENT PRIMARY KEY,
    qu_status VARCHAR(50) NOT NULL,
    qu_type VARCHAR(50) NOT NULL,
    qu_playerId INT,
    FOREIGN KEY (qu_playerId) REFERENCES Player(pl_id)
);

CREATE TABLE Game_1v1PvP (
    ga_id INT AUTO_INCREMENT PRIMARY KEY,
    ga_status VARCHAR(50) NOT NULL,
    ga_gameCreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ga_gameEndTimestamp TIMESTAMP,
    ga_queueId INT,
    player1Id INT NOT NULL,
    player2Id INT NOT NULL,
    player1points INT,
    player2points INT,
    winnerId INT,
    round INT,
    FOREIGN KEY (ga_queueId) REFERENCES Queue(qu_id),
    FOREIGN KEY (player1Id) REFERENCES Player(pl_id),
    FOREIGN KEY (player2Id) REFERENCES Player(pl_id),
    FOREIGN KEY (winnerId) REFERENCES Player(pl_id)
);

CREATE TABLE Obstacle (
    ob_id INT AUTO_INCREMENT PRIMARY KEY,
    ob_gameId INT,
    ob_playerSelectorId INT,
    ob_x INT NOT NULL,
    ob_y INT NOT NULL,
    ob_colorsRemaining TEXT,
    FOREIGN KEY (ob_gameId) REFERENCES Game_1v1PvP(ga_id),
    FOREIGN KEY (ob_playerSelectorId) REFERENCES Player(pl_id)
);


ALTER TABLE Color AUTO_INCREMENT = 1;
ALTER TABLE Player AUTO_INCREMENT = 1;
ALTER TABLE Session AUTO_INCREMENT = 1;
ALTER TABLE Queue AUTO_INCREMENT = 1;
ALTER TABLE Game_1v1PvP AUTO_INCREMENT = 1;
ALTER TABLE Obstacle AUTO_INCREMENT = 1;

INSERT INTO Color (co_hexadecimalColor) VALUES ('FF5733');
INSERT INTO Color (co_hexadecimalColor) VALUES ('33FF57');
INSERT INTO Color (co_hexadecimalColor) VALUES ('3357FF');
INSERT INTO Color (co_hexadecimalColor) VALUES ('FF33A1');
INSERT INTO Color (co_hexadecimalColor) VALUES ('FFEB33');
INSERT INTO Color (co_hexadecimalColor) VALUES ('33FFF3');
