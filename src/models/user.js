// schema for user
const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    created: {type: Date, default: () => new Date()},
});

module.exports = mongoose.model('user', userSchema);
