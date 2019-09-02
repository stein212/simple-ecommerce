CREATE TABLE IF NOT EXISTS Products(
    id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (id)
);
