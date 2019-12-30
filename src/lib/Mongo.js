/**
 * This class will handle all of our interactions with MongoDB 
 * We use Mongoose to allow us to define how our objects will look in the DB
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const MatchModel = require('../models/match');
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

// https://www.npmjs.com/package/bcryptjs

class Mongo {
    constructor() {
        mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
        .then(() => {
            console.log('DB connection successful')
        })
        .catch(err => {
            console.log('DB connection error: ' + err)
        }
    }

    // define functions here

    /**
     * Creates a new user in the database
     * @param {String} userName to store
     * @param {String} password password to hash and store
     */
    newUser(userName, password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {

                //store hash in db
                var newUser = new UserModel({
                username: userName,
                passwordHash: hash,
                created: new Date()
                })

                newUser.save()
                .then(doc => {
                    console.log('New user ' + userName +  ' saved to doc: ' + doc);
                })
                .catch(err => {
                    console.error(err);
                })
            })
        })
    }
                    
    /**
     * Retrieves a user from the DB (verification elsewhere)
     * @param {String} userName to retrieve
     */
    getUser(userName) {
        return new Promise((resolve, reject) => {

        })
    }


}

module.exports = Mongo;