const routes = require('express').Router()
const authController = require('../controllers/auth')

routes.post('/register', authController.register)
routes.post('/login', authController.login)
routes.post('/forgotPassword', authController.forgotPassword)
routes.patch('/resetPassword/:token', authController.resetPassword)
routes.get('/verification/:id', authController.verificationEmail)
routes.get('/verificationForgotPassword/:token', authController.verificationForgotPassword)

module.exports = routes
