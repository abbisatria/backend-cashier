const routes = require('express').Router()
const authController = require('../controllers/auth')

routes.post('/register', authController.register)
routes.post('/login', authController.login)
routes.get('/verification/:id', authController.verificationEmail)

module.exports = routes
