// schema for match
const mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
    opponent: {type: String, required: true},
    wins: {type: Number, required: true},
    losses: {type: Number, required: true},
    date: {type: Date, default : () => new Date()}, 
});

module.exports = mongoose.model('match', matchSchema);
