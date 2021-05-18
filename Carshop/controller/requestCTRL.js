const db = require('../db')

class requestController {

    async getCustomerById(req, res) {
        const id = 9
        const result = await db.query('SELECT * FROM customer WHERE customer_id = $1', [id]);
        res.json(result.rows[0]);
    }
    
    async getAllCustomers(req, res) {
        const result = await db.query('SELECT * FROM customer');
        res.json(result.rows);
    }

    async getTicketByCountry(req, res) {
        const country = 'Britain'
        const result = await db.query('SELECT * FROM ticket WHERE ticket_id IN ' +
        '(SELECT ticket_id FROM ticket WHERE transport_id IN ' +
        '(SELECT transport_id FROM transport WHERE country = $1))', [country]);
        res.json(result.rows);
    }

    async getSaleMagazineByPosition(req, res) {
        const position = 'CEO'
        const result = await db.query('SELECT * FROM sales_magazine WHERE sale_id IN ' +
        '(SELECT sale_id FROM sales_magazine WHERE ticket_id IN ' +
        '(SELECT ticket_id FROM ticket WHERE employee_id IN ' +
        '(SELECT employee_id FROM staff WHERE position = $1)))', [position]);
        res.json(result.rows);
    }
}

module.exports = new requestController();