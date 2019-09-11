const express = require('express')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const passport = require('passport')
const passportConfig = require('./passport')
const authenticationChecker = require('./middlewares/authenticationChecker')

const app = express()

const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        section(name, options) {
            if (!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
})

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.CookiePassword))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
    expressSession({
        secret: process.env.CookiePassword,
        cookie: { httpOnly: true },
        name: 'se_identity',
        resave: true,
        saveUninitialized: false,
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(authenticationChecker)

const controllers = require('./controllers')

controllers.init(app)

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})
