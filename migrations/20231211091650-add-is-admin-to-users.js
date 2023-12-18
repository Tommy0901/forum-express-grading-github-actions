'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Users', // table name
      'is_admin', // column name
      {
        defaultValue: false,
        allowNull: false,
        type: Sequelize.BOOLEAN
      } // type
    )
    await queryInterface.sequelize.query('ALTER TABLE Users MODIFY COLUMN is_admin TINYINT(1) AFTER password;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Users', // table name
      'is_admin' // column name
    )
  }
}
