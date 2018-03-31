USE challenge;

CREATE TABLE users(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  login_ts int(11) NOT NULL DEFAULT 0,
  logout_ts int(11) NOT NULL DEFAULT 0, 
  primary key (id));

CREATE TABLE messages(
  id int NOT NULL AUTO_INCREMENT,
  user varchar(100),
  text varchar(255),
  ts int(11) DEFAULT 0,
  primary key (id));
