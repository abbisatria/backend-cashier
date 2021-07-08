const route = require('express').Router()
const authMiddleware = require('../middlewares/auth')
const uploadProduct = require('../middlewares/uploadProduct')
const productController = require('../controllers/product')

route.get('/', productController.listProduct)
route.post('/', authMiddleware.authCheck, authMiddleware.isAdmin, uploadProduct, productController.createProduct)
route.patch('/:id', authMiddleware.authCheck, authMiddleware.isAdmin, uploadProduct, productController.updateProduct)
route.get('/detail-product/:id', productController.detailProduct)
route.delete('/:id', authMiddleware.authCheck, authMiddleware.isAdmin, productController.deleteProduct)

module.exports = route
