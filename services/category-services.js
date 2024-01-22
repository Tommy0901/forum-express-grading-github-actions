const { Restaurant, Category } = require('../models')

const categoryServices = {
  getCategories: (req, cb) => {
    const id = req.params?.id;
    (async () => {
      try {
        const [category, categories] = await Promise.all([
          id ? Category.findByPk(id, { raw: true }) : undefined,
          Category.findAll({ raw: true })
        ])
        cb(null, { category, categories }, id)
      } catch (err) {
        cb(err)
      }
    })()
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!');
    (async () => {
      try {
        const existedCategory = await Category.findOne({ where: { name } })
        if (existedCategory) throw new Error('Category name has been used!')
        cb(null, { category: await Category.create({ name }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  putCategory: (req, cb) => {
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new Error('Category needs name to add.');
    (async () => {
      try {
        const [category, existdCategoryName] = await Promise.all([Category.findByPk(id), Category.findOne({ where: { name }, raw: true })])
        if (!category) throw new Error("Category didn't exist!")
        if (existdCategoryName && existdCategoryName.id !== category.dataValues.id) throw new Error('Category name has been used!')
        cb(null, { category: await category.update({ name }) })
      } catch (err) {
        cb(err)
      }
    })()
  },
  deleteCategory: (req, cb) => {
    const { id } = req.params;
    (async () => {
      try {
        const category = await Category.findByPk(id) // 接著操作 Sequelize 語法，不加 { raw: true }
        if (!category) throw new Error("Category didn't exist!")
        if (await Restaurant.findOne({ where: { categoryId: id } })) throw new Error("Category has been used, can't be deletd")
        cb(null, { category: await category.destroy() })
      } catch (err) {
        cb(err)
      }
    })()
  }
}
module.exports = categoryServices
