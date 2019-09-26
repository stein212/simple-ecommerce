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
    database: 'se_2',
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
        addProduct(name, price) {
            return new Promise(function(resolve, reject) {
                let productId = uuid()
                pool.query(
                    `INSERT INTO products
                    VALUES
                    (?, ?, ?)`,
                    [productId, name, price],
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
        editProduct(id, name, price) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `UPDATE products
                    SET name = ?,
                    price = ?
                    WHERE id = ?`,
                    [name, price, id],
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
        deleteProduct(id) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `DELETE FROM products
                    WHERE id = ?`,
                    [id],
                    function(err) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(err)
                    }
                )
            })
        },
    },
}

module.exports = dataAccess
