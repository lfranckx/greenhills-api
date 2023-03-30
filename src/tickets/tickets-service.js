const xss = require('xss');
const Treeize = require('treeize');

const TicketsService = {
    getAllTickets(knex) {
        return knex
            .from('tickets')
            .select('*');
    },
    getAllTicketsByLocation(knex, location_id) {
        return knex
            .from('tickets')
            .select('*')
            .where('location_id', location_id);
    },
    getTicketsByDateRange(knex, location_id, from_date, to_date) {
        return knex
            .from('tickets')
            .select('*')
            .where('location_id', location_id)
            .andWhere('date_created', '>=', from_date)
            .andWhere('date_created', '<=', to_date);
    },
    getById(knex, id) {
        return knex
            .from('tickets')
            .select('*')
            .where('id', id)
            .first();
    },
    insertTicket(db, newTicket) {
        return db
            .raw(
                `
                INSERT INTO tickets (custom_message, employee_name, employee_id, location_id, date_created)
                VALUES (?, ?, ?, ?, NOW() AT TIME ZONE 'America/New_York')
                RETURNING *
                `,
                [newTicket.custom_message, newTicket.employee_name, newTicket.employee_id, newTicket.location_id]
            )
            .then((result) => result.rows[0]);
    },
    updateTicket(knex, id, newTicketFields) {
        return knex('tickets')
            .where({ id })
            .update(newTicketFields);
    },
    deleteTicket(knex, id) {
        return knex
            .where({ id })
            .delete();
    },
    serializeTickets(tickets) {
        return tickets.map(this.serializeTicket);
    },
    serializeTicket(ticket) {
        const ticketTree = new Treeize();
        const ticketData = ticketTree.grow([ticket]).getData()[0];
        
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