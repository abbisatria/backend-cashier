const response = (res, status, message, results, pageInfo) => {
  const result = {}
  result.status = status
  result.message = message
  result.results = results
  result.pageInfo = pageInfo

  return res.status(result.status).json(result)
}

module.exports = response
