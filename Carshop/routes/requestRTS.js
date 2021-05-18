const Router = require('express')
const router = new Router();
const controller = require('../controller/requestCTRL')

router.get('/requestOne', controller.getCustomerById) //получает клиента по id
router.get('/requestTwo', controller.getAllCustomers) //получает список клиентов
router.get('/requestThree', controller.getTicketByCountry) //получает список билетов
router.get('/requestFour', controller.getSaleMagazineByPosition) //получает записей из журнала продаж по должности

module.exports = router;