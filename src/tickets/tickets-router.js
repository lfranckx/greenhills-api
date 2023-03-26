const express = require('express');
const jsonParser = express.json();
ticketsRouter = express.json();
const TicketsService = require('./tickets-service');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');
const AuthService = require('../auth/auth-service');

ticketsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        TicketsService.getAllTickets(req.app.get('db'))
        .then(tickets => {
            console.log('Sending all tickets to serialize', tickets);
            res.json(TicketsService.serializeTickets(tickets))
        })
        .catch(next);
    })