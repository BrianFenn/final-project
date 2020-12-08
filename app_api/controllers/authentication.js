var passport = require('passport');     //we need the passport module
var mongoose = require('mongoose');     //we will need the mongoose module
var User = mongoose.model('User');      //import the User model

var sendJSONresponse = function(res, status, content) {
    res.status(status);         //get status code
    res.json(content);          //send response in JSON 
};
//perhaps another validation tool will be used instead of this one
// module.exports.register = function(req, res) {
//     if(!req.body.name || !req.body.email || !req.body.password) {
//         sendJSONresponse(res, 400, {
//             "message": "All fields required"
//         });
//     };
// };

var user = new User();

user.name = req.body.name;      //request body name from JSON in API
user.email = req.body.email;    //request body email from JSON in API

user.setPassword(req.body.password);    //get password from body of JSON API POST & set it to this "user"

user.save(function(error) {     //if not successful generate an error message from function(error)
    var token;  //our variable "token"
    token = user.generateJwt(); //generate our Jwt token 
    res.status(200);        //if token is successful send HTTP response "200" successful
    res.json({              //response will be converted to json as "token" for token variable 
        "token": token
    });
});

module.exports.login = function(req, res) {
    //perhaps we will not use this because we might use another module
    // if(!req.body.email || !req.body.password) {
    //     sendJSONresponse(res, 400, {
    //         "message": "All fields required",
    //     })
    //     return;
    // };

    passport.authenticate('local', function(error, user, info){
        var token;

        //If Passport throws/catches an error then display an HTTP response "404" in json format
        if (error) {
            res.status(404).json(error);
            return;
        }
        
        //If a user if found after HTTP POST request is sent thn send a HTTP response "200" successful & assign a token to keep the user's authenication tracked (i.e. keep the user logged in)
        if(user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            //If user is not found in the MongoDB Database send an HTTP Response "401" unauthorized in json(info) variable for the third part of our passport authenicate function above
            res.status(401).json(info);
        }
    })(req, res);
         
};





