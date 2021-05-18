const Router = require('express')
const router = new Router();
const controller = require('../controller/selectionCTRL')

router.get('/selectionFRB', controller.selectionForReferenceBook) //выборка для справочника
router.get('/selectionFMF', controller.selectionForMainForm) //выборка для главной формы
router.get('/selectionFP/:dates', controller.selectionForPeriod) //выборка за период

module.exports = router;