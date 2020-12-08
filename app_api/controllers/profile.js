var mongoose = require('mongoose'); //we will need the mongoose module for our profile.js controller file
var User = mongoose.model('User'); //we will need the User Model for our profile.js controller file

module.exports.profileRead = function(req, res) {

    if (!req.payload._id) {
        res.status(401).json({      //if the user tries to access a user's account without the "payload" then send an HTTP response "401" unauthrized to access this user's account
            "message": "UnauthorizedError: private profile" //you must be logged in as this user to view this profile
        });
    } else {
        User
            .findById(req.payload._id)  //use mongoose's findById method to search the MongoDB database for the specified id from the HTTP Request
            .exec(function(error, user) {           //execute the function and respond with an error or the user's data
                res.status(200).json(user);//if User _id is found send an HTTP response (200) successful with the json file of the user's data (user)
            });
        }
    };
