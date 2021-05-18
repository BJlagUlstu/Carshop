const db = require('../db')

class transportController {

    async getAllTransports(req, res) {
        const result = await db.query('SELECT * FROM transport');
        res.json(result.rows);
    }

    async getTransport(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT country, brand, model, cost FROM transport WHERE transport_id = $1', [id]);
        res.json(result.rows[0]);
    }
}

module.exports = new transportController();