const passport = require('passport')
const LocalStrategy = require('passport-local')
const dataAccess = require('../data')

passport.use(
    new LocalStrategy(function(username, password, done) {
        dataAccess.users
            .getUser(username)
            .then(async function(user) {
                let isCorrect = await dataAccess.users.comparePassword(
                    password,
                    user.password
                )

                console.log(isCorrect)

                if (!isCorrect)
                    return done(null, false, { message: 'Incorrect password.' })

                done(null, { id: user.id, role: user.discriminator })
            })
            .catch(function(err) {
                done(null, false, { message: 'Invalid username' })
            })
    })
)

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})

module.exports.passportAuth = passport.authenticate('local')
