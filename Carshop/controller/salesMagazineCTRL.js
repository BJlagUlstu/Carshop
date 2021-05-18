const db = require('../db')

class salesMagazineController {

    async getAllSalesMagazines(req, res) {
        const result = await db.query('SELECT * FROM sales_magazine');
        res.json(result.rows);
    }

    async getSale(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT date_of_payment, ticket_id FROM sales_magazine WHERE sale_id = $1', [id]);
        res.json(result.rows[0]);
    }
}

module.exports = new salesMagazineController();