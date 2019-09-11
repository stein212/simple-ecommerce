const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

const hbs = exphbs.create({
    extname: 'hbs', // file extension to be .hbs
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

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
