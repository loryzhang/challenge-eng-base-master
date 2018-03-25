USE challenge;

CREATE TABLE users(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pre_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  primary key (id));

CREATE TABLE messages(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  message varchar(255),
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  primary key (id));

INSERT INTO users (user) value ('Lory');
INSERT INTO users (user) value ('Alex');
INSERT INTO users (user) value ('Gil');


