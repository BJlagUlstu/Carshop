const Router = require('express')
const router = new Router();
const controller = require('../controller/transportCTRL')

router.get('/transports', controller.getAllTransports) //получает список транспортных средств
router.get('/transport/:id', controller.getTransport) //получает транспорт по id

module.exports = router;