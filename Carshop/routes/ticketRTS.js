const Router = require('express')
const router = new Router();
const controller = require('../controller/ticketCTRL')

router.get('/tickets', controller.getAllTickets) //получает список билетов
router.get('/ticket/:id', controller.getTicket) //получает билет по id

module.exports = router;