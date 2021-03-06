require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session')
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require('./config/ppConfig')
const flash = require('connect-flash')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// secret: What we giving the user to use our site / session cookie 
// resave: Save the session even if it's modified, make this false 
// saveUninitiatalized: if we have a new session, we'll save it, therefore, 
// setting this to true 

app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))
// Make sure put this under session 
app.use(passport.initialize())
app.use(passport.session())

// flash for temporary message to the user (error message to users)
app.use(flash());

// middleware to have our message accessible for every view
app.use((req, res, next) => {
// before every route, we will attached our current user to res.local 
res.local.alerts = req.flash();
res.local.currentUser = req.user;
next();
})

app.get('/', (req, res) => {
  res.render('index', { alert:req.flash() });
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
