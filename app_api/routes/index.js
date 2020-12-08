var express = require('express');   //use express for routing our API
var router = express.Router();      //use Express's Router Methods (Library)
var jwt = require('express-jwt');       //use express(routing) with jwt(token information) to maintain user's creditials while interacting with API
var auth = jwt({                    //authorization token in My_Secret_Token_information variable
    secret: 'My_Secret_Token_information',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');    //our index.js file (this file) need to access the controllers folder => "profile" file
var ctrlAuth = require('../controllers/authentication');//our index.js file (this file) need to access the controllers folder => "authenication" file

//profile - get the user's profile information and authenicate it
router.get('/profile', auth, ctrlProfile.profileRead) ;  //API Read method for CRUD functions

//authenication of profile requirement
router.post('/register', ctrlAuth.register);
reouter.post('/login', ctrlAuth.login);

module.exports = router; //  use our router from express for API navigataion
