var mongoose = require('mongoose'); //import mongoose
var crypto = require('crypto'); //import cryptography to encrypt user information
var jwt = require('jsonwebtoken');   //we want to use jwt instead of a cookie for (for non-server) interaction

//Set-up our Model for Email,Name, & encrypt it (with hash and salt it)
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,   //only 1 account per email
        required: true, //must have provide an email to register account (i.e. user)
    },
    name: { //user's name
        type: String,
        required: true, //user must provide a name for registering account
    },
    hash: String,       //declaring our hash & salt will be in string format for encryption
    salt: String,
});
//set-up and encrypt password in database
userSchema.methods.setPassword = function(password) {
    this.salt = cryptorandomBytes(16).toString('hex');      //encrypt our salt from 16 Bytes to hex string when setting up the password
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')  //using Cryptography module's library for encryption method                            
}

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;  //return our encrypted password as 'hash' for validation
}

userSchema.methods.generateJwt = function() {
    var expiry = new Date(); 
    expiry.setDate(expiry.getDate() + 1) //user must re-login with JWT token(non-cookie) after 1 day

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, "My_Secret_Token_information"); //for user to log-in using their secret token information
};

mongoose.model('User', userSchema);     //Use 'User' Schema for modeling User's account information



