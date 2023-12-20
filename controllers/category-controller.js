const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params?.id;
    (async () => {
      try {
        const [categories, category] = await Promise.all([Category.findAll({ raw: true }), Category.findByPk(id, { raw: true })])
        res.render('admin/categories', { categories, category })
      } catch (error) {
        next(error)
      }
    })()
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!');
    (async () => {
      try {
        await Category.create({ name })
        req.flash('success', 'category was successfully added.')
        res.redirect('/admin/categories')
      } catch (error) {
        next(error)
      }
    })()
  },
  putCategory: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new Error('Category needs name to add.');
    (async () => {
      try {
        const category = await Category.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!category) throw new Error("Category didn't exist!")
        await category.update({ name })
        req.flash('success', 'category was successfully updated!')
        res.redirect('/admin/categories')
      } catch (error) {
        next(error)
      }
    })()
  },
  deleteCategory: (req, res, next) => {
    const { id } = req.params;
    (async () => {
      try {
        const category = await Category.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!category) throw new Error("Category didn't exist!")
        await category.destroy()
        req.flash('success', 'category was successfully deleted!')
        res.redirect('/admin/categories')
      } catch (error) {
        next(error)
      }
    })()
  }
}
module.exports = categoryController
