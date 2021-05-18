const Router = require('express')
const router = new Router();
const controller = require('../controller/salesMagazineCTRL')

router.get('/salesMagazines', controller.getAllSalesMagazines) //получает список продаж
router.get('/salesMagazine/:id', controller.getSale) //получает продажу по id
router.post('/salesMagazine', controller.createSalesMagazine) //создает запись продажи
router.put('/salesMagazine', controller.updateSalesMagazine) //редактирует запись в таблице sales_magazine
router.delete('/salesMagazine/:id', controller.deleteSalesMagazine) //удаляет запись продажи

module.exports = router;