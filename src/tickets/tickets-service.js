const xss = require('xss');
const Treeize = require('treeize');

const TicketsService = {
    getAllTickets(knex) {
        console.log('running getAllTickets()...');
        return knex
            .from('tickets')
            .select('*');
    },
    getAllTicketsByLocation(knex, location_id) {
        console.log('running getAllTicketsByLocation()', location_id);
        return knex
            .from('tickets')
            .select('*')
            .where('location_id', location_id);
    },
    getTicketsByDateRange(knex, location_id, from_date, to_date) {
        console.log('running getTicketsByDateRange()', location_id, from_date, to_date);
        return knex
            .from('tickets')
            .select('*')
            .where('location_id', location_id)
            .andWhere('date_created', '>=', from_date)
            .andWhere('date_created', '<=', to_date);
    },
    getById(knex, id) {
        console.log('running getById()...', id);
        return knex
            .from('tickets')
            .select('*')
            .where('id', id)
            .first();
    },
    insertTicket(db, newTicket) {
        console.log('running insertTicket()...', newTicket);
        return db
            .insert(newTicket)
            .into('tickets')
            .returning('*')
            .then(([ticket]) => ticket);
    },
    updateTicket(knex, id, newTicketFields) {
        console.log('running updateTicket()...', `ticket id: ${id}`, `newTicketFields:${newTicketFields}`);
        return knex('tickets')
            .where({ id })
            .update(newTicketFields);
    },
    deleteTicket(knex, id) {
        console.log('deleteTicket()', id);
        return knex
            .where({ id })
            .delete();
    },
    serializeTickets(tickets) {
        console.log('running serializeTickets()...', tickets);
        return tickets.map(this.serializeTicket);
    },
    serializeTicket(ticket) {
        const ticketTree = new Treeize();
        const ticketData = ticketTree.grow([ticket]).getData()[0];

        console.log('Serializing Ticket...', ticket);
        console.log('ticketData...', ticketData);
        return {
            id: ticketData.id,
            custom_message: xss(ticketData.custom_message),
            employee_name: xss(ticketData.employee_name),
            employee_id: xss(ticketData.employee_id),
            location_id: xss(ticketData.location_id),
            date_created: xss(ticketData.date_created)
        };
    }
}

module.exports = TicketsService;