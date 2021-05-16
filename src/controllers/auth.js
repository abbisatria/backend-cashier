const response = require('../helpers/response')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const sendEmail = require('../helpers/sendEmail')
const { APP_URL, APP_KEY } = process.env

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const isExist = await userModel.getUserByCondition({ email })
    if (isExist.length < 1) {
      const salt = await bcrypt.genSalt()
      const encryptedPassword = await bcrypt.hash(password, salt)
      const createUser = await userModel.createUser({ name, email, password: encryptedPassword, role: 2, status: 'pending' })
      if (createUser.insertId > 0) {
        sendEmail(createUser.insertId, `${APP_URL}auth/verification/${createUser.insertId}`, 'Verify Email Address', "Thanks for signing up for CASHIER! We're excited to have you as an early user.")
        return response(res, 200, true, 'Register Succes, Please Verification Email!!')
      } else {
        return response(res, 400, false, 'Register Failed')
      }
    } else {
      return response(res, 400, false, 'Register Failed, email already exists')
    }
  } catch (e) {
    return response(res, 400, false, 'Bad Request')
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const isExist = await userModel.getUserByCondition({ email })
    if (isExist.length > 0) {
      if (isExist[0].status !== 'pending') {
        const compare = bcrypt.compareSync(password, isExist[0].password)
        if (compare) {
          const { id, name, email, picture } = isExist[0]
          const token = jwt.sign({ id, name, email, picture }, APP_KEY)
          const results = {
            token
          }
          return response(res, 200, true, 'Login Successfully', results)
        } else {
          return response(res, 400, false, 'Wrong Password')
        }
      } else {
        return response(res, 400, false, 'Unverified Email')
      }
    } else {
      return response(res, 400, false, 'Email Not Registered')
    }
  } catch (e) {
    return response(res, 400, false, 'Bad Request')
  }
}

exports.verificationEmail = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      await userModel.updateUser(id, { status: 'active' })
      return res.redirect('cashier://activate/success')
    }
    return response(res, 400, false, 'Failed Email Verification')
  } catch (e) {
    return response(res, 400, false, 'Bad Request')
  }
}
