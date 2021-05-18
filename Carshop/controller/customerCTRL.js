const db = require('../db')

class customerController {

    async getAllCustomers(req, res) {
        const result = await db.query('SELECT * FROM customer');
        res.json(result.rows);
    }

    async getCustomer(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT fullname, series_and_number_of_passport FROM customer WHERE customer_id = $1', [id]);
        res.json(result.rows[0]);
    }
}

module.exports = new customerController();