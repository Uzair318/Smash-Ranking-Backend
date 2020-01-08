// schema for user
const mongoose = require('mongoose');
const matchModel = require('./match')

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    created: {type: Date, default: () => new Date()},
    rating_number: {type: Number, required: true},
    games_played: {type: Number, required: true}
    // last match played??
});

module.exports = mongoose.model('user', userSchema);
