// index.js typically handles app startup, routing and other functions
var mongoose = require('mongoose')
var Mongo = require('./src/lib/Mongo')
var { start, stop } = require('./src/lib/server');

start();

var mongo = new Mongo();


mongo.updateRatings('uzibaby', 'leffen', 1, 0)
    .then((outputString) => {
        console.log('output string: ' + outputString)
    })
    // .then(() => {
    //     mongo.updateRatings('uzibaby', 'leffen', 5, 3)
    // })
    