module.exports = {
  generalErrorHandler (error, req, res, next) {
    error instanceof Error
      ? req.flash('error', `${error.name}: ${error.message}`)
      : req.flash('error', `${error}`)
    res.redirect('back')
    next(error) // 將錯誤傳給 express 預設的 error handler middleware
  }
}
