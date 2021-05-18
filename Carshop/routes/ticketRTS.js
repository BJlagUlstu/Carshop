const Router = require('express')
const router = new Router();
const controller = require('../controller/ticketCTRL')

router.get('/tickets', controller.getAllTickets) //получает список билетов
router.get('/ticket/:id', controller.getTicket) //получает билет по id
router.post('/ticket', controller.createTicket) //создает запись с новым билетом
router.put('/ticket', controller.updateTicket) //редактирует запись в таблице ticket
router.delete('/ticket/:id', controller.deleteTicket) //удаляет билет

module.exports = router;