const route = require('express').Router()
const authMiddleware = require('../middlewares/auth')
const uploadProduct = require('../middlewares/uploadProduct')
const productController = require('../controllers/product')

route.get('/', productController.listProduct)
route.post('/', authMiddleware.authCheck, authMiddleware.isAdmin, uploadProduct, productController.createProduct)
route.get('/detail-product/:id', productController.detailProduct)

module.exports = route
