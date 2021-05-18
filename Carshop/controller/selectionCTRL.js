const db = require('../db')

class selectionController {

    async selectionForReferenceBook(req, res) {
        const result = await db.query('SELECT ST.fullname AS student_name, CS.fullname AS customer_name, TR.country, TR.brand, TR.model, TIC.total ' + 
        'FROM ticket TIC JOIN transport TR ' +
        'ON TIC.transport_id = TR.transport_id ' +
        'JOIN customer CS ' +
        'ON TIC.customer_id = CS.customer_id ' +
        'JOIN staff ST ' +
        'ON TIC.student_id = ST.student_id');
        res.json(result.rows);
    }

    async selectionForMainForm(req, res) {
        const result = await db.query('SELECT ST.fullname AS student_name, CS.fullname AS customer_name, TIC.total, SL.date_of_payment ' +
        'FROM ticket TIC JOIN transport TR ' +
        'ON TIC.transport_id = TR.transport_id ' +
        'JOIN customer CS ' +
        'ON TIC.customer_id = CS.customer_id ' +
        'JOIN staff ST ' +
        'ON TIC.student_id = ST.student_id ' +
        'JOIN sales_magazine SL ' +
        'ON SL.ticket_id = TIC.ticket_id');
        res.json(result.rows);
    }

    async selectionForPeriod(req, res) {
        const dates = req.params.dates.split(',')
        const dateFrom = dates[0];
        const dateTo = dates[1];
        const result = await db.query('SELECT SL.date_of_payment, ST.fullname AS student_name, TIC.total ' +
        'FROM sales_magazine SL JOIN ticket TIC ' +
        'ON SL.ticket_id = TIC.ticket_id ' +
        'JOIN staff ST ' +
        'ON TIC.student_id = ST.student_id ' +
        'WHERE SL.date_of_payment > $1 AND SL.date_of_payment < $2', [dateFrom, dateTo]);
        res.json(result.rows);
    }
}

module.exports = new selectionController();