const Router = require('express')
const router = new Router();
const controller = require('../controller/salesMagazineCTRL')

router.get('/salesMagazines', controller.getAllSalesMagazines) //получает список продаж
router.get('/salesMagazine/:id', controller.getSale) //получает продажу по id

module.exports = router;