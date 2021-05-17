const route = require('express').Router()
const authMiddleware = require('../middlewares/auth')
const uploadProduct = require('../middlewares/uploadProduct')
const productController = require('../controllers/product')

route.post('/', authMiddleware.authCheck, authMiddleware.isAdmin, uploadProduct, productController.createProduct)

module.exports = route
