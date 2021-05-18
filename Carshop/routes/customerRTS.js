const Router = require('express')
const router = new Router();
const controller = require('../controller/customerCTRL')

router.get('/customers', controller.getAllCustomers) //получает список всех пользователей
router.get('/customer/:id', controller.getCustomer) //получает пользователя по id
router.post('/customer', controller.createCustomer) //создает запись с новым пользователем
router.put('/customer', controller.updateCustomer) //редактирует запись в таблице customer
router.delete('/customer/:id', controller.deleteCustomer) //удаляет пользователя

module.exports = router;