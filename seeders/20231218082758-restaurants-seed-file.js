'use strict'
const faker = require('faker')
// const fs = require('fs')

const { uploadImageFromUrlToGCS, deleteFileInGCS } = require('../helpers/download-helpers')

const { Restaurant } = require('../models')
const { Op } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const counts = await Restaurant.count()
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const downloadpath = `https://loremflickr.com/320/240/food?/random=${Math.random() * 100}`
    await Promise.all(Array.from({ length: 50 }).map((_, i) => (uploadImageFromUrlToGCS(downloadpath, i + 1 + counts))))
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map((_, i) => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://storage.googleapis.com/test_upload_image/${i + 1 + counts}.jpg`,
        description: faker.lorem.text(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    const counts = await Restaurant.count()
    const { id } = await Restaurant.findOne({ order: [['id', 'DESC']], raw: true })
    for (let i = 0; i < 50; i++) {
      deleteFileInGCS(counts - i)
    }
    await queryInterface.bulkDelete('Restaurants', { id: { [Op.gt]: id - 50 } })
  }
}
