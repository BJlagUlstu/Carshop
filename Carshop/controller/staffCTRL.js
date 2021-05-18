const db = require('../db')

class staffController {

    async getAllStaff(req, res) {
        const result = await db.query('SELECT * FROM staff');
        res.json(result.rows);
    }

    async getStaffUnit(req, res) {
        const id = req.params.id;
        const result = await db.query('SELECT fullname, position, number_of_sales, wage FROM staff WHERE employee_id = $1', [id]);
        res.json(result.rows[0]);
    }
}

module.exports = new staffController();