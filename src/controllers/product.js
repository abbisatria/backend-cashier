const response = require('../helpers/response')
const productModel = require('../models/product')

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body
    const data = {
      name,
      price,
      category,
      picture: req.file === undefined ? null : req.file.filename,
      status: 'available'
    }
    const initialResult = await productModel.createProduct(data)
    if (initialResult.affectedRows > 0) {
      const finalResult = await productModel.getProductByCondition({ id: initialResult.insertId })
      if (finalResult.length > 0) {
        return response(res, 200, true, 'Product Successfully Created', finalResult[0])
      } else {
        return response(res, 400, false, 'Failed to Create Product')
      }
    } else {
      return response(res, 400, false, 'Failed to Create Product')
    }
  } catch (e) {
    return response(res, 400, false, 'Bad Request')
  }
}
