const db = require('../db')

class customerController {

    async getAllCustomers(req, res) {
        const result = await db.query('SELECT * FROM customer');
        res.json(result.rows);
    }

    async getCustomer(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT fullname, series_and_number_of_passport FROM customer WHERE customer_id = $1', [id]);
        var str = result.rows[0].fullname + ',' + result.rows[0].series_and_number_of_passport;
        res.json(str);
    }

    async createCustomer(req, res) {
        const {fullname, series_and_number_of_passport} = req.body;
        await db.query('INSERT INTO customer(fullname, series_and_number_of_passport) VALUES ($1, $2) RETURNING *', [fullname, series_and_number_of_passport]);
        res.send();
    }

    async updateCustomer(req, res) {
        const {customer_id, fullname, series_and_number_of_passport} = req.body;
        await db.query('UPDATE customer SET fullname = $1, series_and_number_of_passport = $2 WHERE customer_id = $3 RETURNING *',
        [fullname, series_and_number_of_passport, customer_id]);
        res.send();
    }

    async deleteCustomer(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM customer WHERE customer_id = $1', [id]);
        res.send();
    }
}

module.exports = new customerController();