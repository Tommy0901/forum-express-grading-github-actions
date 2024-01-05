module.exports = {
  generalErrorHandler (err, req, res, next) {
    err instanceof Error
      ? req.flash('error', `${err.name}: ${err.message}`)
      : req.flash('error', `${err}`)
    res.redirect('back')
    next(err) // 將錯誤傳給 express 預設的 error handler middleware
  },
  apiErrorHandler (err, req, res, next) {
    err instanceof Error
      ? res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
      : res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    next(err)
  }
}
