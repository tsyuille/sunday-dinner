const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const PORT = process.env.PORT || 9000

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

app.use(express.urlencoded( {extended: true} ))
app.use(express.json())
app.use(express.static('public'))
app.use(expressLayouts)

app.use(cookieParser('CookingBlogSecure'))
app.use(methodOverride('_method'))

// Sessions
app.use(session({
  secret: 'RecipeSecretSession',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGODB_URI,})
})
)

app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// app.use(logger('dev'))

// Set global variable
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

app.set('layout', './layout/main')
app.set('view engine', 'ejs')

const routes = require('./server/routes/recipeRoutes')
app.use('/', routes)
app.listen(PORT, () => console.log(`Listening to port ${PORT}`))