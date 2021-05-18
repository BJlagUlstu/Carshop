const Router = require('express')
const router = new Router();
const controller = require('../controller/customerCTRL')

router.get('/customers', controller.getAllCustomers) //получает список всех пользователей
router.get('/customer/:id', controller.getCustomer) //получает пользователя по id

module.exports = router;