'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Restaurants
    ADD COLUMN image VARCHAR(255) AFTER address`
    )

    // await queryInterface.addColumn(
    //   'Restaurants', // table name
    //   'image', // column name
    //   { type: Sequelize.STRING } // type
    // )
    // await queryInterface.sequelize.query('ALTER TABLE restaurants MODIFY COLUMN image VARCHAR(255) AFTER address;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Restaurants
    DROP COLUMN image`
    )

    // await queryInterface.removeColumn(
    //   'Restaurants', // table name
    //   'image' // column name
    // )
  }
}
