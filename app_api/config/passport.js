var passport = require('passport'); //we will need the passport module
var LocalStrategy = require('passport-local').Strategy; //localize passport using the "Strategy" method
var mongoose = require('mongoose'); //we need mongoose to use to validate the user
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'   
},
function(username, password, done) {
    username.findOne({ email: username }, function (error, user) {
        if (error) { return done(error); }
        //Return if the user cannot be found in the database
        if (!user) {
            return done(null, false, {
                message: "The User cannot be found"
            });
        }
        //Return if the password is incorrect
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: "Password is incorrect, please enter the correct password!"
            });
        }
        //if credential are correct, return the user object (i.e. the user's account information) as variable "user"
    });
}
));

