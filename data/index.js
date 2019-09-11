const mysql = require('mysql2')
const uuid = require('uuid/v4')
const moment = require('moment')
const bcrypt = require('bcrypt')
const saltRounds = 13

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: process.env.MysqlUser,
    password: process.env.MysqlPassword,
    database: 'se_3',
})

const localData = require('./productData.json')

// File as database
// const dataAccess = {
//     getAllProducts() {
//         return new Promise(function(resolve, reject) {
//             setTimeout(() => {
//                 resolve(localData)
//             }, 3000)
//         })
//     },
// }

// se_1
// const dataAccess = {
//     getAllProducts() {
//         return new Promise(function(resolve, reject) {
//             pool.query('SELECT * FROM Products', function(
//                 error,
//                 results,
//                 fields
//             ) {
//                 if (error) {
//                     reject(error)

//                     return
//                 }

//                 resolve(results)
//             })
//         })
//     },
//     getProduct(id) {
//         return new Promise(function(resolve, reject) {
//             pool.query('SELECT * FROM Products WHERE id = ?', [id], function(
//                 error,
//                 results,
//                 fields
//             ) {
//                 if (results.length < 1) reject('No such product')

//                 resolve(results[0])
//             })
//         })
//     },
//     addProduct({ name, price }) {
//         return new Promise(function(resolve, reject) {
//             let id = uuid()
//             pool.query(
//                 'INSERT INTO Products Values (?, ?, ?)',
//                 [uuid(), name, price],
//                 function(err, results, fields) {
//                     if (err) reject(err)

//                     resolve({ id, name, price })
//                 }
//             )
//         })
//     },
//     editProduct({ id, name, price }) {
//         return new Promise(function(resolve, reject) {
//             pool.query(
//                 `UPDATE Products
//                 SET name = ?, price = ?
//                 WHERE id = ?`,
//                 [name, price, id],
//                 function(err, results, fields) {
//                     if (err) reject(err)

//                     resolve({ id, name, price })
//                 }
//             )
//         })
//     },
//     deleteProduct(id) {
//         return new Promise(function(resolve, reject) {
//             pool.query(
//                 `DELETE FROM Products
//                 WHERE id = ?`,
//                 [id],
//                 function(err, results, fields) {
//                     if (err) reject(err)

//                     resolve(true)
//                 }
//             )
//         })
//     },
// }

// se_2
// const dataAccess = {
//     users: {
//         async getUser(username) {
//             return new Promise(function(resolve, reject) {
//                 pool.query(
//                     'SELECT * FROM Users WHERE username = ?',
//                     [username],
//                     function(err, results, fields) {
//                         if (
//                             err ||
//                             results === undefined ||
//                             results.length < 1
//                         ) {
//                             reject('No such user')
//                             return
//                         }

//                         resolve(results[0])
//                     }
//                 )
//             })
//         },
//         async registerSeller({
//             username,
//             email,
//             password,
//             firstName,
//             lastName,
//             dob,
//             shopName,
//         }) {
//             let sellerId = uuid()

//             let passwordHash = await bcrypt.hash(password, saltRounds)
//             console.log(
//                 sellerId,
//                 username,
//                 email,
//                 passwordHash,
//                 firstName,
//                 lastName,
//                 moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
//                 shopName
//             )

//             return new Promise(function(resolve, reject) {
//                 pool.query(
//                     `
//                     INSERT INTO Users
//                     (id, username, email, password, firstName, lastName, dob, shopName, discriminator)
//                     VALUES
//                     (?, ?, ?, ?, ?, ?, ?, ?, 'seller')
//                     `,
//                     [
//                         sellerId,
//                         username,
//                         email,
//                         passwordHash,
//                         firstName,
//                         lastName,
//                         moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
//                         shopName,
//                     ],
//                     function(err, results, fields) {
//                         if (err) {
//                             reject(err)
//                             return
//                         }

//                         resolve(sellerId)
//                     }
//                 )
//             })
//         },
//         checkUserPassword({ username, password }) {
//             return new Promise(function(resolve, reject) {
//                 pool.query(
//                     'SELECT password FROM Users WHERE username = ?',
//                     [username],
//                     async function(err, results, fields) {
//                         if (results.length < 1) {
//                             reject('No such user')
//                             return
//                         }

//                         resolve(
//                             await this.comparePassword(
//                                 password,
//                                 results[0].password
//                             )
//                         )
//                     }
//                 )
//             })
//         },
//         async comparePassword(password, passwordHash) {
//             return await bcrypt.compare(password, passwordHash)
//         },
//     },
//     getAllProducts() {
//         return new Promise(function(resolve, reject) {
//             pool.query('SELECT * FROM Products', function(
//                 error,
//                 results,
//                 fields
//             ) {
//                 if (error) reject(error)

//                 resolve(results)
//             })
//         })
//     },
//     getSellerProducts(sellerId) {
//         return new Promise(function(resolve, reject) {
//             pool.query(
//                 'SELECT * FROM Products WHERE sellerId = ?',
//                 [sellerId],
//                 function(err, results, fields) {
//                     if (err) {
//                         reject(err)
//                         return
//                     }

//                     resolve(results)
//                 }
//             )
//         })
//     },
//     getProduct(id) {
//         return new Promise(function(resolve, reject) {
//             pool.query('SELECT * FROM Products', function(
//                 error,
//                 results,
//                 fields
//             ) {
//                 if (results.length < 1) {
//                     reject('No such product')
//                     return
//                 }

//                 resolve(results[0])
//             })
//         })
//     },
//     addProduct({ name, price, sellerId }) {
//         return new Promise(function(resolve, reject) {
//             let id = uuid()
//             pool.query(
//                 'INSERT INTO Products (id, name, price, sellerId) Values (?, ?, ?, ?)',
//                 [id, name, price, sellerId],
//                 function(err, results, fields) {
//                     if (err) {
//                         reject(err)
//                         return
//                     }

//                     resolve({ id, name, price, sellerId })
//                 }
//             )
//         })
//     },
//     editProduct({ id, name, price }) {
//         return new Promise(function(resolve, reject) {
//             pool.query(
//                 `UPDATE Products
//                 SET name = ?, price = ?
//                 WHERE id = ?`,
//                 [name, price, id],
//                 function(err, results, fields) {
//                     if (err) {
//                         reject(err)
//                         return
//                     }

//                     resolve({ id, name, price })
//                 }
//             )
//         })
//     },
//     deleteProduct(id) {
//         return new Promise(function(resolve, reject) {
//             pool.query(
//                 `DELETE FROM Products
//                 WHERE id = ?`,
//                 [id],
//                 function(err, results, fields) {
//                     if (err) {
//                         reject(err)
//                         return
//                     }

//                     resolve(true)
//                 }
//             )
//         })
//     },
// }

// se_3
const dataAccess = {
    users: {
        async getUser(username) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    'SELECT * FROM Users WHERE username = ?',
                    [username],
                    function(err, results, fields) {
                        if (
                            err ||
                            results === undefined ||
                            results.length < 1
                        ) {
                            reject('No such user')
                            return
                        }

                        resolve(results[0])
                    }
                )
            })
        },
        async registerSeller({
            username,
            email,
            password,
            firstName,
            lastName,
            dob,
            shopName,
        }) {
            let sellerId = uuid()

            let passwordHash = await bcrypt.hash(password, saltRounds)
            console.log(
                sellerId,
                username,
                email,
                passwordHash,
                firstName,
                lastName,
                moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
                shopName
            )

            return new Promise(function(resolve, reject) {
                pool.query(
                    `
                    INSERT INTO Users
                    (id, username, email, password, firstName, lastName, dob, shopName, discriminator)
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, 'seller')
                    `,
                    [
                        sellerId,
                        username,
                        email,
                        passwordHash,
                        firstName,
                        lastName,
                        moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
                        shopName,
                    ],
                    function(err, results, fields) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(sellerId)
                    }
                )
            })
        },
        async registerBuyer({
            username,
            email,
            password,
            firstName,
            lastName,
            dob,
            address,
            postalCode,
        }) {
            let buyerId = uuid()

            let passwordHash = await bcrypt.hash(password, saltRounds)
            console.log(
                buyerId,
                username,
                email,
                passwordHash,
                firstName,
                lastName,
                moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
                address,
                postalCode
            )

            return new Promise(function(resolve, reject) {
                pool.query(
                    `
                    INSERT INTO Users
                    (id, username, email, password, firstName, lastName, dob, address, postalCode, discriminator)
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, 'buyer')
                    `,
                    [
                        buyerId,
                        username,
                        email,
                        passwordHash,
                        firstName,
                        lastName,
                        moment(dob, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'),
                        address,
                        postalCode,
                    ],
                    function(err, results, fields) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(buyerId)
                    }
                )
            })
        },
        checkUserPassword({ username, password }) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    'SELECT password FROM Users WHERE username = ?',
                    [username],
                    async function(err, results, fields) {
                        if (results.length < 1) {
                            reject('No such user')
                            return
                        }

                        resolve(
                            await this.comparePassword(
                                password,
                                results[0].password
                            )
                        )
                    }
                )
            })
        },
        async comparePassword(password, passwordHash) {
            return await bcrypt.compare(password, passwordHash)
        },
    },
    products: {
        getAllProducts() {
            return new Promise(function(resolve, reject) {
                pool.query('SELECT * FROM Products', function(
                    error,
                    results,
                    fields
                ) {
                    if (error) reject(error)

                    resolve(results)
                })
            })
        },
        getSellerProducts(sellerId) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    'SELECT * FROM Products WHERE sellerId = ?',
                    [sellerId],
                    function(err, results, fields) {
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
                pool.query('SELECT * FROM Products', function(
                    error,
                    results,
                    fields
                ) {
                    if (results.length < 1) {
                        reject('No such product')
                        return
                    }

                    resolve(results[0])
                })
            })
        },
        addProduct({ name, price, sellerId }) {
            return new Promise(function(resolve, reject) {
                let id = uuid()
                pool.query(
                    'INSERT INTO Products (id, name, price, sellerId) Values (?, ?, ?, ?)',
                    [id, name, price, sellerId],
                    function(err, results, fields) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve({ id, name, price, sellerId })
                    }
                )
            })
        },
        editProduct({ id, name, price, sellerId }) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `UPDATE Products
                SET name = ?, price = ?
                WHERE id = ?
                AND sellerID = ?`,
                    [name, price, id, sellerId],
                    function(err, results, fields) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve({ id, name, price })
                    }
                )
            })
        },
        deleteProduct(id, sellerId) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `DELETE FROM Products
                WHERE id = ?
                AND sellerId = ?`,
                    [id, sellerId],
                    function(err, results, fields) {
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
        addCartItem({ sellerId, id, buyerId }) {
            return new Promise(function(resolve, reject) {
                pool.query(
                    `INSERT INTO cartItems
                    SELECT ?, sellerId, id, name, price, imageUrl
                    FROM products
                    WHERE sellerId = ?
                    AND id = ?`,
                    [buyerId, sellerId, id],
                    function(err, results, fields) {
                        if (err) {
                            reject(err)
                            return
                        }

                        resolve(results)
                    }
                )
            })
        },
    },
}

module.exports = dataAccess
