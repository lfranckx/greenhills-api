const express = require('express');
const jsonParser = express.json();
const usersRouter = express.Router();
const UsersService = require('./users-service');
const path = require('path');

usersRouter
    .post('/', jsonParser, (req, res, next) =>  {
        const { username, password, location_id } = req.body;
        console.log('req.body...', req.body);
        console.log('username...', username);
        console.log('password...', password);
        console.log('typeof password...', typeof password);
        console.log('location_id...', location_id);

        // Check that password is a string
        if (typeof password !== 'string') {
            return res.status(400).json({ error: 'Password must be a string' });
        }

        for (const field of ['username', 'password', 'location_id'])
            if (!req.body[field])
            return res.status(400).json({
                error: `Missing ${field} in request body`
            });

        const passwordError = UsersService.validatePassword(password);
        if (passwordError) 
            return res.status(400).json({ error: passwordError });

        UsersService.hasUserWithUsername(
            req.app.get('db'),
            username
        )
        .then(hasUserWithUsername => {
            if (hasUserWithUsername)
                return res.status(400).json({ error: 'Username is already taken' });

            return UsersService.hashPassword(password)
            .then(hashedPassword => {
                const newUser = {
                    username,
                    password: hashedPassword,
                    location_id,
                    date_created: 'now()'
                }

                return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                .then(user => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(UsersService.serializeUser(user));
                });
            });
        })
        .catch(next);
    });

module.exports = usersRouter;