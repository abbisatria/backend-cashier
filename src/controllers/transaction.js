const response = require('../helpers/response')
const transactionModel = require('../models/transaction')
const qs = require('querystring')
const { APP_URL } = process.env

exports.listTransaction = async (req, res) => {
  try {
    const cond = req.query
    cond.dateMin = cond.dateMin || ''
    cond.dateMax = cond.dateMax || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 5
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'id'
    cond.order = cond.order || 'DESC'

    const results = await transactionModel.getTransactionByCondition(cond)
    const totalData = await transactionModel.getCountTransactionByCondition(cond)
    const totalPage = Math.ceil(Number(totalData[0].totalData) / cond.limit)

    const finalResult = results.map((item) => {
      const map = item.product.split(', ')
      const product = map.map(val => {
        const split = val.split('=')
        return { name: split[0], price: split[1] }
      })
      return {
        id: item.id,
        user_id: item.user_id,
        no_transaction: item.no_transaction,
        product: product,
        quantity: item.quantity,
        total: item.total,
        note: item.note,
        createdAt: item.createdAt
      }
    })

    const totalPendapatan = await transactionModel.getOverallncome(cond)

    return response(res, 200, true, 'List Transaction', { data: finalResult, ...totalPendapatan[0] }, {
      totalData: totalData[0].totalData,
      currentPage: cond.page,
      totalPage,
      nextLink: cond.page < totalPage ? `${APP_URL}transaction/?${qs.stringify({ ...req.query, ...{ page: cond.page + 1 } })}` : null,
      prevLink: cond.page > 1 ? `${APP_URL}transaction/?${qs.stringify({ ...req.query, ...{ page: cond.page - 1 } })}` : null
    })
  } catch (e) {
    console.log(e)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const data = req.body
    const noTransaction = `TR${new Date().getTime()}`
    const result = await transactionModel.createTransaction({
      user_id: req.userData.id,
      no_transaction: noTransaction,
      quantity: data.quantity,
      total: data.total,
      note: data.note
    })
    if (result.affectedRows > 0) {
      if (typeof data.idProduct === 'object') {
        await transactionModel.createTransactionHistory(result.insertId, data.idProduct)
      } else {
        await transactionModel.createTransactionHistory(result.insertId, [data.idProduct])
      }
      return response(res, 200, true, 'Transaction Successfully')
    } else {
      return response(res, 400, false, 'Failed to Transaction')
    }
  } catch (e) {
    console.log(e)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.overallIncome = async (req, res) => {
  try {
    const results = await transactionModel.getOverallncome()
    return response(res, 200, true, 'Overall Income', results[0])
  } catch (e) {
    console.log(e)
    return response(res, 400, false, 'Bad Request')
  }
}

exports.getChart = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const dateNow = new Date(new Date(today).getTime() + 1 * 31 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const lastWeekDate = new Date(new Date(dateNow).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const initialResult = await transactionModel.getTransactionLastWeek(dateNow, lastWeekDate)

    if (initialResult.length < 1) {
      return response(res, 200, true, 'You havent made a transaction')
    }

    const day = [
      {
        id: 1,
        eng: 'Sun',
        ind: 'Min'
      },
      {
        id: 2,
        eng: 'Mon',
        ind: 'Sen'
      },
      {
        id: 3,
        eng: 'Tue',
        ind: 'Sel'
      },
      {
        id: 4,
        eng: 'Wed',
        ind: 'Rab'
      },
      {
        id: 5,
        eng: 'Thu',
        ind: 'Kam'
      },
      {
        id: 6,
        eng: 'Fri',
        ind: 'Jum'
      },
      {
        id: 7,
        eng: 'Sat',
        ind: 'Sab'
      }
    ]

    const finalResult = Object.values(initialResult.reduce((unique, item) => {
      if (!unique[item.createdAt.toISOString().slice(0, 10)]) {
        unique[item.createdAt.toISOString().slice(0, 10)] = ({
          total: initialResult.reduce((value, result) => {
            if (item.createdAt.toISOString().slice(0, 10) === result.createdAt.toISOString().slice(0, 10)) {
              value.push(result.total)
            } else {
              value.push(0)
            }
            return value
          }, []).reduce((prev, next) => prev + next),
          day: day.reduce((val, reslt) => {
            if (String(item.createdAt).slice(0, 3) === reslt.eng) {
              val.push(reslt.ind)
            }
            return val
          }, []).reduce((prev, next) => prev + next)
        })
      }

      return unique
    }, {}))

    // if (finalResult.length < 7) {
    //   const addResult = 7 - finalResult.length
    //   for (let initial = 0; initial < addResult; initial++) {
    //     const obj = {
    //       total: 0,
    //       day: ' '
    //     }
    //     finalResult.push(obj)
    //   }
    // }

    return response(res, 200, true, 'controller runing well', finalResult)
  } catch (e) {
    console.log(e)
    return response(res, 400, false, 'Bad Request')
  }
}
