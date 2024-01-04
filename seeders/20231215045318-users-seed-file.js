'use strict'
const bcrypt = require('bcryptjs')
const users = require('../public/jsons/users')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (const user of users) {
      const { name, email, password: plaintext, is_admin, image } = user
      const password = await bcrypt.hash(plaintext, 10)
      await queryInterface.bulkInsert('Users', [{ name, email, password, is_admin, image }])
    }
  },

  async down (queryInterface, Sequelize) {
    for (const user of users) {
      await queryInterface.bulkDelete('Users', { email: user.email })
    }
  }
}
