const db = require('../db')

class ticketController {

    async getAllTickets(req, res) {
        const result = await db.query('SELECT * FROM ticket');
        res.json(result.rows);
    }

    async getTicket(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT total, customer_id, student_id, transport_id FROM ticket WHERE ticket_id = $1', [id]);
        var str = result.rows[0].total + ',' + result.rows[0].customer_id + ',' + result.rows[0].student_id + ',' + result.rows[0].transport_id;
        res.json(str);
    }

    async createTicket(req, res) {
        const {total, transport_id, customer_id, student_id} = req.body;
        await db.query('INSERT INTO ticket(total, transport_id, customer_id, student_id) VALUES ($1, $2, $3, $4) RETURNING *', [total, transport_id, customer_id, student_id]);
        res.send();
    }

    async updateTicket(req, res) {
        const {ticket_id, total, transport_id, customer_id, student_id} = req.body;
        await db.query('UPDATE ticket SET total = $1, transport_id = $2, customer_id = $3, student_id = $4 WHERE ticket_id = $5 RETURNING *',
        [total, transport_id, customer_id, student_id, ticket_id]);
        res.send();
    }

    async deleteTicket(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM ticket WHERE ticket_id = $1', [id]);
        res.send();
    }
}

module.exports = new ticketController();