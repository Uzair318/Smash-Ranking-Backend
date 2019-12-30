// index.js typically handles app startup, routing and other functions
var mongoose = require('mongoose')
var Mongo = require('./src/lib/Mongo')
var { start, stop } = require('./src/lib/server');

start();

var mongo = new Mongo();


