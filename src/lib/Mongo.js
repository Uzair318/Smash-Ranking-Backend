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

                if(err) { //test this 
                    reject(error);
                }
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
            .catch((err) => {
                console.log(err)
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
     * @param {String} player1 winner
     * @param {String} player2 loser
     * @param {Number} wins number of games won by player1 (and lost by player2)
     * @param {Number} losses number of games lost by player1 (and won by player2)
     */
    updateRatings(player1, player2, wins, losses) {
        return new Promise((resolve, reject) => {

            // grab the user models from the DB
            var promise1 = new Promise((resolve, reject) => {
                UserModel.findOne({username: player1}, (error, user1) => {
                    if(error) {
                        reject(error)
                    } else {
                        resolve(user1)
                    }
                })
            })
            var promise2 = new Promise((resolve, reject) => {
                UserModel.findOne({username: player2}, (error, user2) => {
                    if(error) {
                        reject(error)
                    } else {
                        resolve(user2)
                    }
                })
            })
            .catch((err) => { //if there is an error at this point, catch it
                console.log(err);
            })

            Promise.all([promise1, promise2])
                .then((users) => {

                    console.log('second round of single wins: ' + [elo.newRatingIfWon(1016, 1000-16), elo.newRatingIfLost(1000-16, 1000+16)]);

                    const oldRating1 = users[0].rating_number;
                    const oldRating2 = users[1].rating_number;
                    console.log('old ratings: ' + [oldRating1, oldRating2])

                    //calculate change in elo for a single win
                    const eloChange = elo.newRatingIfWon(oldRating1, oldRating2) - oldRating1;
                    console.log('elo change for single game: ' + eloChange);

                    // caluculate new ratings for player1
                    // PLAYER1's BRANCH
                    var updatePlayer1 = new Promise((resolve, reject) => {

                        // adjust score for wins and losses
                        // console.log('elo change 1: ' + (wins - losses) * eloChange)
                        users[0].rating_number = oldRating1 + ((wins - losses) * eloChange);
                        resolve(users[0])
                    })
                    .then((user1) => {
                        // update number of games played by player 1
                        user1.games_played += wins + losses;
                        // console.log('new rating 1: ' + users[0].rating_number)
                        return(user1);
                    })
                    .then((user1) => {
                        // update player1 in database
                        console.log('user1 being saved: ');
                        console.log(user1) 
                        UserModel.findOneAndUpdate({username: player1}, user1, (error, result) => {})
                        return('user ' + user1.username + ' rating updated to ' + user1.rating_number)
                    })
                    .catch((error) => {
                        reject(error);
                    })


                    // caluculate new ratings for player2 and increment 
                    // PLAYER2's BRANCH
                    var updatePlayer2 = new Promise((resolve, reject) => {
                        // console.log('elo change 2: ' + (losses - wins) * eloChange)
                        users[1].rating_number = oldRating2 + ((losses - wins) * eloChange);
                        resolve(users[1])
                    })
                    .then((user2) => {
                        // update number of games played by player 1
                        user2.games_played += wins + losses;
                        // console.log('new rating 2: ' + users[1].rating_number)
                        return user2;
                    })
                    .then((user2) => {
                        // update player2 in database
                        console.log('user2 being saved: ');
                        console.log(user2)
                        UserModel.findOneAndUpdate({username: player2}, user2, (error, result) => {})
                        return('user ' + user2.username + ' rating updated to ' + user2.rating_number)
                    })
                    .catch((error) => {
                        reject(error);
                    })

                    // resolve out of Promise.all's .then()
                    // resolve(users)
                    return users
                    
                })
                .then((users) => {
                    // resolve out of function

                    // console.log('resolving')
                    var newRatings = [users[0].rating_number, users[1].rating_number];
                    // console.log(newRatings)
                    return(newRatings)
                })
                .catch((err) => {
                    reject(err)
                })

        })
        
    }
}



module.exports = Mongo;