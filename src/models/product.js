const db = require('../helpers/db')

exports.getProductByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    db.query(`
    SELECT * 
    FROM product 
    ${(cond && cond.sort && cond.order && cond.limit && cond.order)
      ? `WHERE ${cond.category ? `category="${cond.category}" AND` : ''} name LIKE "%${cond.search}%" ORDER BY ${cond.sort} ${cond.order} LIMIT ${cond.limit} OFFSET ${cond.offset}`
      : cond
      ? `WHERE ${Object.keys(cond).map(item => `${item}="${cond[item]}"`).join(' AND ')}`
      : ''}
      `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.getCountProductByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(id) as totalData FROM product ${(cond && cond.category) ? `WHERE category="${cond.category}" AND name LIKE "%${cond.search}%" ORDER BY ${cond.sort} ${cond.order}` : `WHERE name LIKE "%${cond.search}%" ORDER BY ${cond.sort} ${cond.order}`}`, (err, res, field) => {
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

exports.updateProduct = (id, data) => {
  return new Promise((resolve, reject) => {
    const key = Object.keys(data)
    const value = Object.values(data)
    db.query(`UPDATE product SET ${key.map((item, index) => `${item}="${value[index]}"`)} WHERE id=${id}`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM product WHERE id=${id}`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}
