const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth');

const jsonBodyParser = express.json();
const authRouter = express.Router();

authRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body;
        const loginUser = { username, password };

        console.log('loginUser...', loginUser);

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                });

        AuthService.getUserWithUsername(
            req.app.get('db'),
            loginUser.username
        )
        .then(dbUser => {
            console.log('dbUser...', dbUser);
            if (!dbUser)
                return res.status(400).json({
                    error: 'Incorrect username or password'
                });
            
            return AuthService.comparePasswords(loginUser.password, dbUser.password)
                .then(compareMatch => {
                    console.log('compareMatch...', compareMatch);
                    if (!compareMatch)
                    return res.status(400).json({
                        error: 'Incorrect username or password',
                    });

                    const sub = dbUser.username;
                    const payload = { user_id: dbUser.id };
                    console.log('sub, payload...', sub, payload);
                    console.log('authToken...', AuthService.createJwt(sub, payload));
                    console.log('location_id...', dbUser.location_id);
                    res.send({
                        authToken: AuthService.createJwt(sub, payload),
                        location_id: dbUser.location_id
                    });
                });
        })
        .catch(next);
    });

authRouter
    .post('/refresh', requireAuth, (req, res) => {
        const sub = req.user.username;
        const payload = { user_id: req.user.id };
        res.send({
            authToken: AuthService.createJwt(sub, payload),
            location_id: req.user.location_id
        });
    });

module.exports = authRouter;