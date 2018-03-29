USE challenge;

CREATE TABLE users(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  ts int(11) NOT NULL DEFAULT 0,
  pre_ts int(11) NOT NULL DEFAULT 0, 
  primary key (id));

CREATE TABLE messages(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  text varchar(255),
  ts int(11) DEFAULT 0,
  primary key (id));

CREATE TABLE room1(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  primary key (id));

INSERT INTO users (user) value ('Lory');
INSERT INTO users (user) value ('Alex');
INSERT INTO users (user) value ('Gil');
