const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const dataAccess = require('./data')

const app = express()

const port = 3000

const hbs = exphbs.create({
    extname: 'hbs', // file extension to be .hbs
    helpers: {
        // allows for sectioning (see main.hbs layout and the other normal views)
        section(name, options) {
            if (!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
})

// name the engine hbs
app.engine('hbs', hbs.engine)
// set the 'view engine' to the named engine
app.set('view engine', 'hbs')

// body-parser is to allow us to get data from form posts
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) {
    // getAllProducts returns a js promise
    dataAccess
        .getAllProducts()
        // once the promise is done getting the data, 'then' do the function
        .then(function(data) {
            // make a string representation of the data
            let products = JSON.stringify(data)

            // pass the `products` into the view
            res.render('index', { title: 'Products', products })
        })
})

// :id allows the route to know that the string after '/viewProduct/' is a variable
// then allowing us to use it via 'req.params.id'
app.get('/viewProduct/:id', function(req, res) {
    dataAccess.getProduct(req.params.id).then(function(product) {
        res.render('viewProduct', { title: product.name, product })
    })
})

app.get('/addProduct', function(req, res) {
    res.render('addProduct', { title: 'Add Product' })
})

app.post('/addProduct', function(req, res) {
    // req.body refers to the body of the request (requests have a header and body)
    dataAccess.addProduct(req.body.name, req.body.price).then(function(id) {
        res.redirect(`/ViewProduct/${id}`)
    })
})

app.get('/editProduct/:id', function(req, res) {
    dataAccess.getProduct(req.params.id).then(function(product) {
        res.render('editProduct', { title: 'editProduct', product })
    })
})

app.post('/editProduct/:id', function(req, res) {
    // req.body refers to the body of the request (requests have a header and body)
    dataAccess
        .editProduct(req.params.id, req.body.name, req.body.price)
        .then(function(isEdited) {
            res.redirect(`/ViewProduct/${req.params.id}`)
        })
})

app.post('/deleteProduct/:id', function(req, res) {
    dataAccess.deleteProduct(req.params.id).then(function(isDeleted) {
        res.redirect('/')
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
