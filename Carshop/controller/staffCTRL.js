const db = require('../db')

class staffController {

    async getAllStaff(req, res) {
        const result = await db.query('SELECT * FROM staff');
        res.json(result.rows);
    }

    async getStaffUnit(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT fullname, position, number_of_sales, wage FROM staff WHERE employee_id = $1', [id]);
        var str = result.rows[0].fullname + ',' + result.rows[0].position + ',' + result.rows[0].number_of_sales + ',' + result.rows[0].wage;
        res.json(str);
    }

    async createStaffUnit(req, res) {
        const {fullname, position, number_of_sales, wage} = req.body;
        await db.query('INSERT INTO staff(fullname, position, number_of_sales, wage) VALUES ($1, $2, $3, $4) RETURNING *', [fullname, position, number_of_sales, wage]);
        res.send();
    }

    async updateStaffUnit(req, res) {
        const {employee_id, fullname, position, number_of_sales, wage} = req.body;
        await db.query('UPDATE staff SET fullname = $1, position = $2, number_of_sales = $3, wage = $4 WHERE employee_id = $5 RETURNING *',
        [fullname, position, number_of_sales, wage, employee_id]);
        res.send();
    }

    async deleteStaffUnit(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM staff WHERE employee_id = $1', [id]);
        res.send();
    }
}

module.exports = new staffController();