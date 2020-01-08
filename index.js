// index.js typically handles app startup, routing and other functions
var mongoose = require('mongoose')
var Mongo = require('./src/lib/Mongo')
var { start, stop } = require('./src/lib/server');

start();

var mongo = new Mongo();

mongo.newUser('leffen', 'largeWilliam')
.then(() => {
    mongo.updateRatings('uzibaby', 'leffen', 1, 0)
    .then((uzairs_rating) => {
        console.log(uzairs_rating)
    })
})

