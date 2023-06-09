const express = require('express');
const jsonParser = express.json();
const ticketsRouter = express.Router();
const TicketsService = require('./tickets-service');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');

ticketsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        TicketsService.getAllTickets(req.app.get('db'))
        .then(tickets => {
            res.json(TicketsService.serializeTickets(tickets))
        })
        .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { custom_message, employee_name, employee_id, location_id, numOfTickets } = req.body;

        const newTicket = { custom_message, employee_name, employee_id, location_id };
        
        for (const [key, value] of Object.entries(newTicket))
        if (value == null)
            return res.status(400).json({
                message: `Missing ${key} in request body`
            });

        newTicket.date_created = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

        // iterate over numOfTickets and insert newTicket each time
        const promises = [];
        for (let i = 0; i < numOfTickets; i++) {
            promises.push(TicketsService.insertTicket(
                req.app.get('db'),
                newTicket
            ));
        }
        
        Promise.all(promises)
        .then(tickets => {
            const serializedTickets = tickets.map(ticket => TicketsService.serializeTicket(ticket));
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${serializedTickets[0].id}`))
                .json(serializedTickets);
        })
        .catch(next);
    });

// get tickets by location
ticketsRouter
    .route('/location/:location_id')
    .all(checkLocationExists)
    .post(requireAuth, jsonParser, (req, res, next) => {
        const { from_date, to_date } = req.body;
        const locationId = req.params.location_id;

        TicketsService.getTicketsByDateRange(
            req.app.get('db'),
            locationId,
            from_date,
            to_date
        )
        .then(tickets => {
            res.json(TicketsService.serializeTickets(tickets));
        })
        .catch(next);
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
                    message: `Ticket was not found`
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
                message: `Request body must contain custom_message, employee_name, employee_id, location_id`
            }));

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
    try {
        const location = await TicketsService.getAllTicketsByLocation(
            req.app.get('db'),
            req.params.location_id
        );

        if (!location)
            return res.status(404).json({
                message: `This location does not exist.`
            });
        
        res.location = location;
        next();
    } catch(error) {
        next(error);
    }
}

async function checkTicketExists(req, res, next) {
    try {
        const ticket = await TicketsService.getById(
            req.app.get('db'),
            req.params.id
        );

        if (!ticket)
            return res.status(404).json({
                message: `This ticket does not exists.`
            });

        res.ticket = ticket;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = ticketsRouter;