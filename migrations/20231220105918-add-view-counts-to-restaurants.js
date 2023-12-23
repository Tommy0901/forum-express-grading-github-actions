'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Restaurants
    ADD COLUMN view_count INT DEFAULT 0 AFTER category_id`
    )

    // await queryInterface.addColumn(
    //   'Restaurants', // table name
    //   'view_count', // column name
    //   {
    //     type: Sequelize.INTEGER,
    //     defaultValue: 0
    //   } // type
    // )
    // await queryInterface.sequelize.query('ALTER TABLE Restaurants MODIFY COLUMN view_count INT DEFAULT 0 AFTER category_id;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Restaurants
    DROP COLUMN view_count`
    )

    // await queryInterface.removeColumn(
    //   'Restaurants', // table name
    //   'view_count' // column name
    // )
  }
}
