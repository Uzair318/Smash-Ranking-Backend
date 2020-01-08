/**
 * This class will handle all of our interactions with MongoDB 
 * We use Mongoose to allow us to define how our objects will look in the DB
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const MatchModel = require('../models/match');
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

// how models work: https://mongoosejs.com/docs/models.html

class Mongo {
    constructor() {
        mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
        .then(() => {
            console.log('DB connection successful');
        })
        .catch(err => {
            console.log('DB connection error: ' + err);
        })
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
                    created: new Date(),
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
            UserModel.findOne({username: userName}, (error, user) => {
                if(error) {
                    reject(error)
                } else {
                    //console.log('user: ' + user)
                    resolve(user);
                }
            }) 
        })
    }

    /**
     * Updates players' ratings after a match
     * @param {String} player1 first player's username
     * @param {String} player2 second player's username
     * @param {Number} wins number of games won by player1 (and lost by player2)
     * @param {Number} losses number of games lost by player1 (and won by player2)
     */
    updateRatings(player1, player2, wins, losses) {
        return new Promise((resolve, reject) => {

            numGames = wins + losses; //total # of games played

            // grab the user models from the DB
            user1 = getUser(player1);
            user2 = getUser(player2);

            Promise.all([user1, user2])
            .then((users) => {

                // caluculate new ratings for each player
                rating1 = users[0].rating_number;
                rating2 = users[1].rating_number;

                users[0].rating_number = ((rating2 + 400(wins - losses)) / numGames);
                users[1].rating_number = ((rating1 + 400(losses - wins)) / numGames);

                // increment games played
                users[0].numGames = user[0].numGames + 1;
                users[1].numGames = user[1].numGames + 1;

                resolve(users)
                
            })
            .then((users) => {
                // save updated users to database 
                // UserModel.findOneAndUpdate({username: player1}, users[0], (error, result) => {})
                // UserModel.findOneAndUpdate({username: player2}, users[1], (error, result) => {})
                users[0].save();
                users[1].save();
                resolve(users[0].rating_number)
            })
            .catch((err) => {
                reject(err)
            })
        })
            
    }
        
    
}



module.exports = Mongo;