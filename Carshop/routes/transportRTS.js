const Router = require('express')
const router = new Router();
const controller = require('../controller/transportCTRL')

router.get('/transports', controller.getAllTransports) //получает список транспортных средств
router.get('/transport/:id', controller.getTransport) //получает транспорт по id
router.post('/transport', controller.createTransport) //создает запись с новым транспортом
router.put('/transport', controller.updateTransport) //редактирует запись в таблице transport
router.delete('/transport/:id', controller.deleteTransport) //удаляет транспорт

module.exports = router;