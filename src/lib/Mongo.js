/**
 * This class will handle all of our interactions with MongoDB 
 * We use Mongoose to allow us to define how our objects will look in the DB
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const MatchModel = require('../models/match');
const UserModel = require('../models/user');



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
    newUser() {
        return new Promise((resolve, reject) => {
            var newUser = new UserModel({
                username: 'exampleUserName',
                passwordHash: 'examplePasswordHash',
                created: new Date()
            })

            newUser.save()
                .then(doc => {
                    console.log('New user saved to doc: ' + doc);
                })
                .catch(err => {
                    console.error(err);
                })

        })
    }

}

module.exports = Mongo;