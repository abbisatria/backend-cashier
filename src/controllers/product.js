const response = require('../helpers/response')
const productModel = require('../models/product')
const { APP_URL } = process.env
const qs = require('querystring')

exports.listProduct = async (req, res) => {
  try {
    const cond = req.query
    cond.search = cond.search || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 5
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'id'
    cond.order = cond.order || 'DESC'

    const results = await productModel.getProductByCondition(cond)
    const totalData = await productModel.getCountProductByCondition(cond)
    const totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)

    return response(res, 200, true, 'List Product', results, {
      totalData: totalData[0].totalData,
      currentPage: cond.page,
      totalPage,
      nextLink: cond.page < totalPage ? `${APP_URL}product/?${qs.stringify({ ...req.query, ...{ page: cond.page + 1 } })}` : null,
      prevLink: cond.page > 1 ? `${APP_URL}product/?${qs.stringify({ ...req.query, ...{ page: cond.page - 1 } })}` : null
    })
  } catch (e) {
    console.log(e)
    return response(res, 400, false, 'Bad Request')
  }
}

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

exports.detailProduct = async (req, res) => {
  try {
    const { id } = req.params
    const results = await productModel.getProductByCondition({ id })
    if (results.length > 0) {
      return response(res, 200, true, 'Detail Product', results)
    } else {
      return response(res, 404, false, `Product ${id} Not Found`)
    }
  } catch (e) {
    return response(res, 400, false, 'Bad Request')
  }
}
