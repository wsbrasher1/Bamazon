DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
item_id INTEGER(15) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(35) NOT NULL,
department_name VARCHAR(20) NOT NULL,
price DECIMAL(8,2) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Madden NFL 20", "Video Games", 59.99, 250), ("Red Dead Redemption Two","Video Games", 34.99, 300),
("Samurai Shodown", "Video Games", 59.99, 500), ("Insignia 39 inch TV", "Electronics", 179.99, 150), 
("Beats Wireless Headphones", "Electronics", 224.99, 250), ("Audio-Technica Turntable", "Electronics", 99.99, 400),
("Gibson Les Paul", "Music", 2499.99, 50), ("Gibson SG Guitar", "Music", 1200.99, 75), ("Gretsch Maple Drum Kit", "Music", 799.99, 25),
("Luna Guitars Ukulele", "Music", 59.99, 125);

