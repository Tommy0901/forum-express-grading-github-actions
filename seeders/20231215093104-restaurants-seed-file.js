'use strict'
const faker = require('faker')
const axios = require('axios')
const fs = require('fs')

const { Restaurant } = require('../models')
const { Op } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const counts = await Restaurant.count()
    for (let i = 0; i < 50; i++) {
      const fileNumber = i + 1 + counts
      const response = await axios.get(`https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`, { responseType: 'arraybuffer' })
      fs.writeFileSync(`public/upload/${fileNumber}.jpg`, Buffer.from(response.data))
      console.log(`Image downloaded and saved to upload/${fileNumber}.jpg`)
    }
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }), (_, i) => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `/upload/${i + 1 + counts}.jpg`,
        description: faker.lorem.text()
      })
    )
  },
  down: async (queryInterface, Sequelize) => {
    const counts = await Restaurant.count()
    const { id } = await Restaurant.findOne({ order: [['id', 'DESC']], raw: true })
    for (let i = 0; i < 50; i++) {
      fs.unlink(`public/upload/${counts - i}.jpg`, error =>
        error
          ? console.error('Error deleting file:', error)
          : console.log(`Image upload/${counts}.jpg was deleted`)
      )
    }
    await queryInterface.bulkDelete('Restaurants', { id: { [Op.gt]: id - 50 } })
  }
}
