/* modifications to th default Express set-up is commented with [SH] to find them */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
//[SH] Require Passport     //we are using Passport to authenicate the user's login so this will modify express's set-up
var passport = require('passport');

//[SH] We will need to import the data model for the users 
require('./api/models/db'); //we are using the data model from our api folder (no need to duplicate)
//[SH] We will need to import the config file for the Passport module from our api folder too in order to setup our Passport module for verifying authenication
require('./api/config/passport');

//[SH] We will need to import the routes from our API folder to know what routes will be used for making requests with the database and application
var routesFromApi = require('./api/routes/index');  //e.g. we will have the routes for POST - register & Login & GET - user's profile  
const { reset } = require('nodemon');

//we need to setup our view engine (i.e. jade) we could use others like pug or handlebars(aka hbs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); //.set is used by express to set our view engine (see express.js.com/en/5x/api.html#app.set)

//we can place our favicon in /public and uncomment this out to have a favicon(i.e. icon) in our browser tab displayed
//app.use(favicon(__dirname + '/public/favicon.ico'))

//tell Express we plan to use logger, body parser, cookieparser & cors with our application
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

//[SH] "Initialize [the] Passport Module before using the route middleware" (gnomeontherun, 2018)
app.use(passport.initialize());

//[SH] Use the API routes when the path starts with /api
app.use('/api', routesApi); //our variable routesApi method will be called when the user makes requests to our directory "/api"

//[SH] Use the 404 HTTP Status Code when a catch from an error is made (i.e. for error handling)
app.use(function(req, res, next) {
    var error = new Error('Your item was not found!');
    error.status = 404;     //i.e. HTTP Response "Not Found"
    next(error);    //repeat error message if another error is present
});

// error handling

//[SH] How to handle (i.e. Catch) errors due to unauthorized requests (i.e. user requests an object without authentication)
app.use(function (error, req, res, next) {
    if (error.name === 'UnauthorizedError') {     //we have seen this from app_api/controllers/profile.js file 401 response with message "UnauthorizedError: Private Profile"
        res.status(401);        //response with HTTP status 401 "Unauthorized"
        res.json({"message" : error.name + ": " + error.message });       //respond in JSON file to user with an error message for the name of the user whom the user does not have access to their profile (i.e. account)
    }
});

//for development- handling errors
//we can trace any errors for debugging using the code below
if (app.get('env') === 'development') {
    app.use(function(error, req, res, next) {
        res.status(error.status || 500);    //give us the error.status or an HTTP response "Internal Server Error" is not error.status message is available
        res.render('error', {
            message: error.message,
            error: error
        });
    });
}

//when using the production version of this application - this is how we can handle an error
//to prevent a stacktrace from being leaked to the user we can do the following:
app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
});

module.exports = app;       //export app to application's modules