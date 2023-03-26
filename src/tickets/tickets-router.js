const express = require('express');
const jsonParser = express.json();
const ticketsRouter = express.Router();
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
    .post(jsonParser, (req, res, next) => {
        const { custom_message, employee_name, employee_id, location_id } = req.body;
        console.log('.post route / req body...', req.body);

        const newTicket = { custom_message, employee_name, employee_id, location_id };
        
        for (const [key, value] of Object.entries(newTicket))
        if (value == null)
            return res.status(400).json({
                error: `Missing ${key} in request body`
            });

        console.log('inserting newTicket...', newTicket);
        return TicketsService.insertTicket(
            req.app.get('db'),
            newTicket
        )
        .then(ticket => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${ticket.id}`))
                .json(TicketsService.serializeTicket(ticket));
        })
        .catch(next);
    });

// get tickets by location
ticketsRouter
    .route('/location/:location_id')
    .all(checkLocationExists)
    .get(requireAuth, (res) => {
        res.json(TicketsService.serializeTicket(res.ticket));
    });
    

// requests for ticket by id
ticketsRouter
    .route('/:id')
    .all(checkTicketExists)
    .get(requireAuth, jsonParser, (req, res, next) => {
        const { id } = req.params;
        TicketsService.getById(req.app.get('db'), id)
        .then(ticket => {
            if (!ticket) {
                return res.status(404).json({
                    error: { message: `Ticket was not found` }
                })
            }
            res.json(TicketsService.serializeTicket(ticket));
        })
        .catch(next);
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const { id, custom_message, employee_name, employee_id, location_id } = req.body;
        const ticketToUpdate = { id, custom_message, employee_name, employee_id, location_id };
        const numOfValues = Object.values(ticketToUpdate).filter(Boolean).length;
        if (numOfValues === 0)
            return (res.status(400).json({
                error: {
                    message: `Request body must contain custom_message, employee_name, employee_id, location_id`
                }
            }));

        console.log(`Updating Ticket by id...`, id);
        console.log(`ticketToUpdate...`, ticketToUpdate);

        TicketsService.updateTicket(
            req.app.get('db'),
            id,
            ticketToUpdate
        )
        .then(numRowsAffected => {
            res.json(numRowsAffected).status(204).end();
        })
        .catch(next);
    })
    .delete(requireAuth, jsonParser, (req, res, next) => {       
        console.log(`Deleting Ticket by id...`, req.params.id); 
        TicketsService.deleteTicket(
            req.app.get('db'),
            req.params.id
        )
        .then(numRowsAffected => {
            res.json(numRowsAffected).status(204).end();
        })
        .catch(next);
    });

async function checkLocationExists(req, res, next) {
    console.log('checkLocationExists req.params...', req.params);
    try {
        const location = await TicketsService.getAllTicketsByLocation(
            req.app.get('db'),
            req.params.location_id
        );

        if (!location)
            return res.status(404).json({
                error: `This location does not exist.`
            });
        
        res.location = location;
        next();
    } catch(error) {
        next(error);
    }
}

async function checkTicketExists(req, res, next) {
    console.log('checkTicketExists req.params...', req.params);
    try {
        const ticket = await TicketsService.getById(
            req.app.get('db'),
            req.params.id
        );

        if (!ticket)
            return res.status(404).json({
                error: `This ticket does not exists.`
            });

        res.ticket = ticket;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = ticketsRouter;