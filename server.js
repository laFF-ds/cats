require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const sessions = require('express-session')
const mongoStore = require('connect-mongo')
const flash = require('express-flash')
const cors = require('cors')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db
.once('open', () => console.log('Connected to Database'))
.once('close', () => console.log('Disconncted from Database'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'ejs')
app.use(express.static(__dirname+ '/'))
app.use(
    cors({
        origin: "*",
})
)

const oneDay = 86400000

app.use(sessions({
    name: 'cat',
    secret: "secret",
    saveUninitialized: false,
    sameSite: 'none',
    cookie: {
        maxAge: oneDay,
        secure: false,
        httpOnly: false
    },
    resave: false,
    store: mongoStore.create({
        mongoUrl: 'mongodb://localhost/users'
    }),
}))

app.use(flash())

app.get('/', (req, res) => {
    session = req.session
    if(session.userid)
    {
        req.flash('loggedin', 'Log Out')
        res.render('index.ejs')
    }
    else
    {
        req.flash('loggedout', 'Log In')
        res.render('index.ejs')
    }
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/favorites', (req, res) => {
    if(req.session.userid)
    {
        res.render('favorites.ejs')
    }
    else
    {
        req.flash('nofavorites', 'please login to view favorites')
        res.redirect('/')
        
    }
})

app.get('/logout', (req, res) => 
{
    if (req.session && req.session.cookie) 
    {
        res.cookie('cat', null,
        {
            maxAge: 0
        })
    }
    req.session.destroy()
    res.redirect('/')
})

const userRouter = require('./routes/user/users')
app.use('/user/users', userRouter)

const registerRouter = require('./routes/register')
app.use('/register', registerRouter)

const loginRouter = require('./routes/login')
app.use('/login', loginRouter)

const favoritesRouter = require('./routes/user/favorites')
app.use('/user/favorites', favoritesRouter)

app.listen(3000, () => console.log('Server Started :)'))