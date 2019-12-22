import {Router} from 'express';
import bodyParser from 'body-parser';

import basicAuth from '../lib/basic-auth-middleware.js'
import User from '../model/user.js';

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
    console.log('hit /signup');

    User.create(req.body)
    // https://mherman.org/blog/token-based-authentication-with-node/
})