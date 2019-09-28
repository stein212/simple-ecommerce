CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NUll,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    dob TIMESTAMP NOT NULL,
    discriminator VARCHAR(255) NOT NULL,
    address VARCHAR(255) NULL,
    postalCode VARCHAR(255) NULL,
    shopName VARCHAR(255) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Products (
    sellerId VARCHAR(255) NOT NULL,
    id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    imageUrl VARCHAR(255) NULL,
    FOREIGN KEY (sellerId) REFERENCES `Users` (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (sellerId, id)
);

CREATE TABLE IF NOT EXISTS CartItems (
    buyerId VARCHAR(255) NOT NULL,
    sellerId VARCHAR(255) NOT NULL,
    productId VARCHAR(255) NOT NULL,
    id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (buyerId) REFERENCES `Users` (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (sellerId, productId) REFERENCES `Products` (sellerId, id)
    ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (buyerId, sellerId, productId)
);
