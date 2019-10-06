//RestaurantIO

//Declarations
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var nocache = require('nocache');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

//Initialize
app.use(nocache());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//Passport setup
require('./app/passport')(passport);
app.use(session({
    secret: '',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Content
app.use('/content', express.static(__dirname+'/content'));

//Data Access
var dataAccess = require("./app/dataAccess.js");

//Router 
require('./app/routes.js')(app, passport, dataAccess);

//Start
app.listen(port);
console.log('Website launch on port ' + port);