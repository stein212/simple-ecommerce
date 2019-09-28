const mysql = require('mysql2')
const uuid = require('uuid/v4')
const bcrypt = require('bcrypt')
const moment = require('moment')

const saltRounds = 13

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MysqlUser, // replace with your own user and password
    password: process.env.MysqlPassword,
    database: 'se_3',
})

const dataAccess = {
    users: {
        getUser(id) {
            return new Promise(function(resolve, reject) {
                pool.query('SELECT * FROM users WHERE id = ?', [id], function(
                    err,
                    results
                ) {
                    if (err || results.length < 1) {
                        reject('No such user')
                        return
                    }

                    resolve(results[0])
                })
            })
        },
        getUserByUsername(username) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    'SELECT * FROM users WHERE username = ?',
                    [username],
                    function(err, results) {
                        if (err || results.length < 1) {
                            reject('No such user')
                            return
                        }

                        resolve(results[0])
                    }
                )
            })
        },
        registerSeller(
            email,
            username,
            password,
            firstName,
            lastName,
            dob,
            shopName
        ) {
            return new Promise(async function(resolve, reject) {
                let userId = uuid()
                let passwordHash = await bcrypt.hash(password, saltRounds)
                pool.query(
                    `
                    INSERT INTO users
                    (id, email, username, password, firstName, lastName, dob, shopName, discriminator)
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, 'seller')`,
                    [
                        userId,
                        email,
                        username,
                        passwordHash,
                        firstName,
                        lastName,
                        moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
                        shopName,
                    ],
                    function(err, results) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(userId)
                    }
                )
            })
        },
        registerBuyer(
            email,
            username,
            password,
            firstName,
            lastName,
            dob,
            address,
            postalCode
        ) {
            return new Promise(async function(resolve, reject) {
                let userId = uuid()
                let passwordHash = await bcrypt.hash(password, saltRounds)
                pool.query(
                    `
                    INSERT INTO users
                    (id, email, username, password, firstName, lastName, dob, address, postalCode, discriminator)
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, 'buyer')`,
                    [
                        userId,
                        email,
                        username,
                        passwordHash,
                        firstName,
                        lastName,
                        moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
                        address,
                        postalCode,
                    ],
                    function(err, results) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(userId)
                    }
                )
            })
        },
        checkCredentials(username, password) {
            // using arrow function to bind `this` to dataAccess object
            return new Promise((resolve, reject) => {
                pool.query(
                    `SELECT password FROM users
                    WHERE username = ?`,
                    [username],
                    async (err, results) => {
                        if (err || results.length < 0) {
                            resolve(false)
                        }

                        return resolve(
                            await this.checkPassword(
                                password,
                                results[0].password
                            )
                        )
                    }
                )
            })
        },
        async checkPassword(password, passwordHash) {
            return await bcrypt.compare(password, passwordHash)
        },
    },
    products: {
        getAllProducts() {
            return new Promise(function(resolve, reject) {
                pool.query('SELECT * FROM products', function(err, results) {
                    if (err) {
                        reject(err)
                        return
                    }

                    resolve(results)
                })
            })
        },
        getProductsBySellerId(id) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    'SELECT * FROM products WHERE sellerId = ?',
                    [id],
                    function(err, results) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(results)
                    }
                )
            })
        },
        getProduct(id) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `SELECT * FROM products
                    WHERE id = ?`,
                    [id],
                    function(err, results) {
                        // if has error or no product by that `id`
                        if (err || results.length < 1) {
                            reject(`No product by id: ${id}`)
                            return
                        }

                        resolve(results[0])
                    }
                )
            })
        },
        addProduct(sellerId, name, price) {
            return new Promise(function(resolve, reject) {
                let productId = uuid()
                pool.query(
                    `INSERT INTO products
                    (sellerId, id, name, price)
                    VALUES
                    (?, ?, ?, ?)`,
                    [sellerId, productId, name, price],
                    function(err) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(productId)
                    }
                )
            })
        },
        editProduct(sellerId, id, name, price) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `UPDATE products
                    SET name = ?,
                    price = ?
                    WHERE id = ?
                    AND sellerId = ?`,
                    [name, price, id, sellerId],
                    function(err) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(true)
                    }
                )
            })
        },
        deleteProduct(sellerId, id) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `DELETE FROM products
                    WHERE id = ?
                    AND sellerId = ?`,
                    [id, sellerId],
                    function(err) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(true)
                    }
                )
            })
        },
    },
    cartItems: {
        getBuyerCartItems(buyerId) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `SELECT p.id, p.sellerId, p.name, p.price, ci.quantity FROM CartItems ci
                    INNER JOIN Products p
                    ON ci.productId = p.id
                    WHERE buyerId = ?`,
                    [buyerId],
                    function(err, results) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(results)
                    }
                )
            })
        },
        addToCart(buyerId, productId, quantity) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `SELECT sellerId FROM Products
                    WHERE id = ?`,
                    [productId],
                    function(err, results) {
                        if (err) {
                            reject(err)
                            return
                        }

                        const sellerId = results[0].sellerId

                        pool.query(
                            `SELECT * FROM CartItems
                            WHERE buyerId = ?
                            AND sellerId = ?
                            AND productId = ?`,
                            [buyerId, sellerId, productId],
                            function(err, results) {
                                if (err) {
                                    reject(err)
                                    return
                                }

                                if (results.length > 0) {
                                    quantity += results[0].quantity

                                    pool.query(
                                        `UPDATE CartItems
                                        SET quantity = ?
                                        WHERE buyerId = ?
                                        AND sellerId = ?
                                        AND productId = ?`,
                                        [
                                            quantity,
                                            buyerId,
                                            sellerId,
                                            productId,
                                        ],
                                        function(err, results) {
                                            if (err) {
                                                reject(err)
                                                return
                                            }

                                            resolve(quantity)
                                        }
                                    )
                                } else {
                                    console.log(
                                        buyerId,
                                        sellerId,
                                        productId,
                                        quantity
                                    )
                                    pool.query(
                                        `INSERT INTO CartItems
                                        VALUES
                                        (?, ?, ?, ?)`,
                                        [
                                            buyerId,
                                            sellerId,
                                            productId,
                                            quantity,
                                        ],
                                        function(err, results) {
                                            if (err) {
                                                reject(err)
                                                return
                                            }

                                            resolve(quantity)
                                        }
                                    )
                                }
                            }
                        )
                    }
                )
            })
        },
        updateCartItem(buyerId, productId, quantity) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `SELECT sellerId FROM Products
                    WHERE id = ?`[productId],
                    function(err, results) {
                        if (err) {
                            reject(err)
                            return
                        }

                        const sellerId = results[0]

                        pool.query(
                            `UPDATE CartItems
                            SET quantity = ?
                            WHERE buyerId = ?
                            AND sellerId = ?
                            AND productId = ?`,
                            [quantity, buyerId, sellerId, productId],
                            function(err, results) {
                                if (err) {
                                    reject(err)
                                    return
                                }

                                resolve(quantity)
                            }
                        )
                    }
                )
            })
        },
    },
}

module.exports = dataAccess
