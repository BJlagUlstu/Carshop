const Router = require('express')
const router = new Router();
const controller = require('../controller/staffCTRL')

router.get('/staff', controller.getAllStaff) //получает список сотрудников
router.get('/staff/:id', controller.getStaffUnit) //получает сотрудника по id

module.exports = router;