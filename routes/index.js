var express = require('express');
var router = express.Router();

/*Get Our Home page*/
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'})     //render our homepage with an index titled "Express"
});

module.exports.router;