// index.js typically handles app startup, routing and other functions
var mongoose = require('mongoose')
var Mongo = require('./src/lib/Mongo')
var { start, stop } = require('./src/lib/server');

start();

var mongo = new Mongo();


mongo.updateRatings('uzibaby', 'leffen', 1, 0)
    .then((newRatings) => {
        console.log("uzibaby's new rating: " + newRatings[0]);
        console.log("leffen's new rating: " + newRatings[1]);
    })
    