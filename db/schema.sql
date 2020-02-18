### Schema

CREATE DATABASE travel_db;
USE travel_db;

CREATE TABLE flights
(
	id int NOT NULL AUTO_INCREMENT,
	price varchar(255) NOT NULL,
	PRIMARY KEY (id)
);
