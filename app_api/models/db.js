var mongoose = require('mongoose'); //we will need mongoose to interact with our MongoDB
var shutdownNicely;   //we will want our program to end nicely
var dbURI = "mongodb://localhost/meanAuth"; //the resource to authenticate access to Mongodb

if(process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;       //if our Node Environment is working, using DB for MONGO_URI 
} 

mongoose.connect(dbURI);    //connect to our MongoDB database

//The Status of our Connections to our Database (i.e. MongoDB)
mongoose.connection.on('connection', function() {
    console.log('Mongoose is connected to ' + dbURI);   //tell console when we are connected to db
});

mongoose.connection.on('error', function(error) {
    console.log('Mongoose connection encountered an error: ' + error);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose has been disconnected');      //tell console when the database connection has ended
});

//Set-up Termination events (& Restart events) for letting user(i.e. console) know what's happening to the connections to interaction with the Database
shutdownNicely = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose has disconnected through ' + msg);    //tell console why connection was disconnected
        callback();
    });
};

//when nodemon restarts - tell user (SIGUSER2)
process.once('SignalUser2', function() {
    shutdownNicely('nodemon restart', function() {
        process.kill(process.pid, 'SignalUser2')
    });
});

//When user logs out, terminate application session
process.on('SignalInitilization', function() {
    shutdownNicely('application termination', function() {
        process.exit(0);        //exit application
    })
});

//Closing the Application through Heroku
process.on('SignalTermination', function() {
    shutdownNicely('Heroku app termination', function () {
        process.exit(0);    //exit application through Heroku (online deployment)
    });
});

//Import our Schemas and Models from our Application (i.e. /users) to verify which account is being accessed (logged in & out)
require('./users');