const route = require('express').Router()
const authMiddleware = require('../middlewares/auth')
const transactionController = require('../controllers/transaction')

route.post('/', authMiddleware.authCheck, transactionController.createTransaction)
route.get('/', authMiddleware.authCheck, transactionController.listTransaction)
route.get('/overall-income', authMiddleware.authCheck, transactionController.overallIncome)
route.get('/chart', authMiddleware.authCheck, transactionController.getChart)

module.exports = route
