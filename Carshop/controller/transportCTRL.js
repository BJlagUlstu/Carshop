const db = require('../db')

class transportController {

    async getAllTransports(req, res) {
        const result = await db.query('SELECT * FROM transport');
        res.json(result.rows);
    }

    async getTransport(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT country, brand, model, cost FROM transport WHERE transport_id = $1', [id]);
        var str = result.rows[0].country + ',' + result.rows[0].brand + ',' + result.rows[0].model + ',' + result.rows[0].cost;
        res.json(str);
    }

    async createTransport(req, res) {
        const {country, brand, model, cost} = req.body;
        await db.query('INSERT INTO transport(country, brand, model, cost) VALUES ($1, $2, $3, $4) RETURNING *', [country, brand, model, cost]);
        res.send();
    }

    async updateTransport(req, res) {
        const {transport_id, country, brand, model, cost} = req.body;
        await db.query('UPDATE transport SET country = $1, brand = $2, model = $3, cost = $4 WHERE transport_id = $5 RETURNING *',
        [country, brand, model, cost, transport_id]);
        res.send();
    }

    async deleteTransport(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM transport WHERE transport_id = $1', [id]);
        res.send();
    }
}

module.exports = new transportController();