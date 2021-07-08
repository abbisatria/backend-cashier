const db = require('../helpers/db')

exports.createTransaction = (data) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`INSERT INTO transactions (${Object.keys(data).join()}) VALUES (${Object.values(data).map(item => `"${item}"`).join(',')})`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.createTransactionHistory = (idTransaction, product) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`INSERT INTO transactions_history (id_transaction, id_product) 
    VALUES ${product.map(item => `(${idTransaction}, ${item})`).join()}`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.getTransactionByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT t.*, GROUP_CONCAT(DISTINCT p.name,'=', p.price ORDER BY p.name DESC SEPARATOR ', ') AS product
    FROM transactions t 
    LEFT JOIN transactions_history th on t.id = th.id_transaction 
    LEFT JOIN product p on th.id_product = p.id 
    ${cond.dateMin && cond.dateMax
      ? `WHERE (t.createdAt BETWEEN '${cond.dateMin} 00:00:00' AND '${cond.dateMax} 23:59:00')`
      : ''}
    GROUP BY t.id, t.user_id, t.no_transaction, t.quantity, t.total, t.note, t.createdAt, t.updatedAt 
    ORDER BY t.${cond.sort} ${cond.order} 
    LIMIT ${cond.limit} OFFSET ${cond.offset}`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.getCountTransactionByCondition = (cond) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(id) as totalData FROM transactions 
    ${cond.dateMin && cond.dateMax
      ? `WHERE createdAt BETWEEN '${cond.dateMin} 00:00:00' AND '${cond.dateMax} 23:59:00'`
      : ''}
    ORDER BY ${cond.sort} ${cond.order}`, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
  })
}

exports.getOverallncome = (cond) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT SUM(total) as total FROM transactions ${cond.dateMin && cond.dateMax
      ? `WHERE createdAt BETWEEN '${cond.dateMin} 00:00:00' AND '${cond.dateMax} 23:59:00'`
      : ''} ORDER BY ${cond.sort} ${cond.order} 
      LIMIT ${cond.limit} OFFSET ${cond.offset}
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}

exports.getTransactionLastWeek = (dateNow, lastWeekDate) => {
  return new Promise((resolve, reject) => {
    const query = db.query(`
    SELECT * FROM transactions
    WHERE
    createdAt >= '${lastWeekDate}' AND '${dateNow}' >= createdAt
    ORDER BY createdAt ASC
    `, (err, res, field) => {
      if (err) reject(err)
      resolve(res)
    })
    console.log(query.sql)
  })
}
