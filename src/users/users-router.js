const express = require('express');
const jsonParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const usersRouter = express.Router();
const UsersService = require('./users-service');
const path = require('path');

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const { username, password } =req.body;
        for (const field of ['username', 'password'])
            if (!req.body[field])
            return res.status(400).json({
                error: `Missing ${field} in request body`
            });

        
    });