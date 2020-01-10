/**
 * This class will handle all of our interactions with MongoDB 
 * We use Mongoose to allow us to define how our objects will look in the DB
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const MatchModel = require('../models/match');
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const Elo = require('arpad');

const elo = new Elo();

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
            var numGames = wins + losses; //total # of games played

            // grab the user models from the DB

            var promise1 = new Promise((resolve, reject) => {
                UserModel.findOne({username: player1}, (error, user1) => {
                    if(error) {
                        reject(error)
                    } else {
                        // console.log('user1: ')
                        // console.log(user1)
                        resolve(user1)
                    }
                })
            })
            var promise2 = new Promise((resolve, reject) => {
                UserModel.findOne({username: player2}, (error, user2) => {
                    if(error) {
                        reject(error)
                    } else {
                        // console.log('user2: ')
                        // console.log(user2)
                        resolve(user2)
                    }
                })
            })
            .catch((err) => { //if there is an error at this point, catch it
                console.log(err);
            })

            Promise.all([promise1, promise2])
                .then((users) => {

                    const oldRating1 = users[0].rating_number;
                    const oldRating2 = users[1].rating_number;
 
                    /**
                     * This is written such that a win is a best of 3 match
                     *   -maybe write different functions for single matches, best of 3, best of 5
                     * 
                     */

                    var updatePlayer1 = new Promise((resolve, reject) => {
                        // caluculate new ratings for player1 and increment numGames
                        users[0].rating_number = elo.newRatingIfWon(oldRating1, oldRating2);
                        users[0].games_played++;
                        resolve(users[0])
                    })
                    .then((user1) => {
                        console.log('user1 being saved: ');
                        console.log(user1) 
                        UserModel.findOneAndUpdate({username: player1}, user1, (error, result) => {})
                        return('user ' + user1.username + ' rating updated to ' + user1.rating_number)
                    })

                    var updatePlayer2 = new Promise((resolve, reject) => {
                        // caluculate new ratings for player2 and increment numGames
                        users[1].rating_number = elo.newRatingIfLost(oldRating2, oldRating1);
                        users[1].games_played = users[1].games_played + 1; // IS THIS ACTUALLY UPDATING?
                        resolve(users[1]);
                    })
                    .then((user2) => {
                        console.log('user2 being saved: ');
                        console.log(user2)
                        UserModel.findOneAndUpdate({username: player2}, user2, (error, result) => {})
                        return('user ' + user2.username + ' rating updated to ' + user2.rating_number)
                    })
                    resolve(users)
                })
                .then((users) => {
                    console.log('resolving')
                    resolve(users)
                })
                .catch((err) => {
                    reject(err)
                })
        })
            
    }
        
    
}



module.exports = Mongo;