//import packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();

// env variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = Promise; //not sure what this does tbh (sets to standard promise?)

// connect to MongoDB
mongoose.connect(MONGO_URI, () => {
    console.log('connected to DB');
})

app.use(bodyParser.json(), cors()) // cross origin resource sharing

app.use(require('.../route/auth-router')); // see if this is brought up again

// for now just return 404 to every route
app.all('*', (request, response) => {
    console.log('returning 404 to catch-all route')
    return response.sendStatus(404);
})

app.use(require('./error-middleware')); // see if this is brought up again

// start command
export const start = () => {
    app.listen(PORT, () => {
        console.log('listening on port: ' + PORT);
    })
}

// stop command
export const stop = () => {
    app.close(PORT, () => {
        console.log('shut down on port: ' + PORT);
    })
}



