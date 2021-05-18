const db = require('../db')

class ticketController {

    async getAllTickets(req, res) {
        const result = await db.query('SELECT * FROM ticket');
        res.json(result.rows);
    }

    async getTicket(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT total, customer_id, employee_id, transport_id FROM ticket WHERE ticket_id = $1', [id]);
        res.json(result.rows[0]);
    }
}

module.exports = new ticketController();