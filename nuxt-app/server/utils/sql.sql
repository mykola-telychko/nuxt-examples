CREATE DATABASE test;
USE  test;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
INSERT INTO products (name, price) VALUES ('item 1', 25.99);
INSERT INTO products (name, price) VALUES ('item 2', 19.50);
INSERT INTO products (name, price) VALUES ('one more item', 99.99);