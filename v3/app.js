const express = require('express')
const exphbs = require('express-handlebars')
const dataAccess = require('./data')

const app = express()

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

const port = 3000

// http://localhost:3000
app.get('/', function(req, res) {
    // renders 'views > index.hbs'
    // the content in index.hbs is placed in the {{{ body }}} of 'views > layouts > main.hbs'
    // title refers to the title 'slot' we created in main.hbs
    res.render('index', { title: 'Simple E-Commerce' })
})

app.get('/products1', function(req, res) {
    res.render('products1', { title: 'Products 1' })
})

app.get('/products2', function(req, res) {
    res.render('products2', { title: 'Products 2' })
})

app.get('/products3', function(req, res) {
    // getAllProducts returns a js promise
    dataAccess
        .getAllProducts()
        // once the promise is done getting the data, 'then' do the function
        .then(function(data) {
            // make a string representation of the data
            let products = JSON.stringify(data)

            // pass the `products` into the view
            res.render('products3', { title: 'Products 3', products })
        })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
