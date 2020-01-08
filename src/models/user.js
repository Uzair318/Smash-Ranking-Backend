// schema for user
const mongoose = require('mongoose');
const matchModel = require('./match')

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    created: {type: Date, default: () => new Date()},
    rating_number: {type: Number, default: 1000},
    games_played: {type: Number, default: 0}
    // last match played??
});

module.exports = mongoose.model('user', userSchema);
