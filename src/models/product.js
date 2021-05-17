const db = require('../helpers/db')

exports.getProductByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM product WHERE ${Object.keys(cond).map(item => `${item}="${cond[item]}"`).join(' AND ')}`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.createProduct = (data) => {
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO product (${Object.keys(data).join()}) VALUES (${Object.values(data).map(item => `"${item}"`).join(',')})`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}
