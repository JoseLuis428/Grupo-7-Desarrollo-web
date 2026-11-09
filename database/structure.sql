CREATE DATABASE IF NOT EXISTS star_coffee
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE star_coffee;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(60) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password VARCHAR(255) NOT NULL,
  photo VARCHAR(120) NULL DEFAULT NULL,
  category ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT chk_users_first_name CHECK (CHAR_LENGTH(first_name) >= 2),
  CONSTRAINT chk_users_last_name CHECK (CHAR_LENGTH(last_name) >= 2),
  CONSTRAINT chk_users_email CHECK (email LIKE '%_@_%._%')
);

CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  slug VARCHAR(60) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
);

CREATE TABLE sizes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sizes_name (name)
);

CREATE TABLE products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  price INT UNSIGNED NOT NULL,
  section ENUM('recomendado', 'vendido') NULL DEFAULT NULL,
  category_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_products_category (category_id),
  CONSTRAINT chk_products_name CHECK (CHAR_LENGTH(name) >= 5),
  CONSTRAINT chk_products_description CHECK (CHAR_LENGTH(description) >= 20),
  CONSTRAINT chk_products_price CHECK (price > 0),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE product_size (
  product_id INT UNSIGNED NOT NULL,
  size_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (product_id, size_id),
  KEY idx_product_size_size (size_id),
  CONSTRAINT fk_product_size_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_product_size_size
    FOREIGN KEY (size_id) REFERENCES sizes (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
