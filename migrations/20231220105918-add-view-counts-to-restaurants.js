'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Restaurants', // table name
      'view_count', // column name
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      } // type
    )
    await queryInterface.sequelize.query('ALTER TABLE restaurants MODIFY COLUMN view_count INT(11) DEFAULT 0 AFTER category_id;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Restaurants', // table name
      'view_count' // column name
    )
  }
}
