//import packages
var express = require('express');
var cors = require('cors')
var mongoose = require('mongoose')
var Mongo = require('./Mongo.js')
var bodyParser = require('body-parser')

const app = express();
const router = express.Router();
const dotenv = require('dotenv').config();

// env variables
const PORT = process.env.PORT || 8000;

var mongo = new Mongo

app.use(bodyParser.json(), cors()) // cross origin resource sharing


// // for now just return 404 to every route
// app.all('*', (request, response) => {
//     console.log('returning 404 to catch-all route')
//     return response.sendStatus(404);
// })

app.get('/allUsers', (request, response) => {
    mongo.getAllUsers()
    .then((users) => {
        console.log('sending users to ' + PORT)
        response.send(users);
    })
})

app.post('/newUser', (request, response) => {
    mongo.newUser()
})

// app.get('/groups=239408123', (req, res) => {




// app.use(require('./error-middleware')); // if we use error middleware

// start command
exports.start = () => {
    app.listen(PORT, () => {
        console.log('server listening on port: ' + PORT);
    })
}

// stop command
exports.stop = () => {
    app.close(PORT, () => {
        console.log('server shut down on port: ' + PORT);
    })
}

