const db = require('../db')

class salesMagazineController {

    async getAllSalesMagazines(req, res) {
        const result = await db.query('SELECT * FROM sales_magazine');
        res.json(result.rows);
    }

    async getSale(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT date_of_payment, ticket_id FROM sales_magazine WHERE sale_id = $1', [id]);
        var str = new Date(result.rows[0].date_of_payment).format('yyyy-mm-dd') + ',' + result.rows[0].ticket_id;
        res.json(str);
    }

    async createSalesMagazine(req, res) {
        const {date_of_payment, ticket_id} = req.body;
        await db.query('INSERT INTO sales_magazine(date_of_payment, ticket_id) VALUES ($1, $2) RETURNING *', [date_of_payment, ticket_id]);
        res.send();  
    }

    async updateSalesMagazine(req, res) {
        const {sale_id, date_of_payment, ticket_id} = req.body;
        await db.query('UPDATE sales_magazine SET date_of_payment = $1, ticket_id = $2 WHERE sale_id = $3 RETURNING *',
        [date_of_payment, ticket_id, sale_id]);
        res.send();
    }

    async deleteSalesMagazine(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM sales_magazine WHERE sale_id = $1', [id]);
        res.send();
    }
}

module.exports = new salesMagazineController();