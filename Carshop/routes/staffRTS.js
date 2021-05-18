const Router = require('express')
const router = new Router();
const controller = require('../controller/staffCTRL')

router.get('/staff', controller.getAllStaff) //получает список сотрудников
router.get('/staff/:id', controller.getStaffUnit) //получает сотрудника по id
router.post('/staff', controller.createStaffUnit) //создает запись с новым сотрудником
router.put('/staff', controller.updateStaffUnit) //редактирует запись в таблице staff
router.delete('/staff/:id', controller.deleteStaffUnit) //удаляет сотрудника

module.exports = router;