'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Users', // table name
      'is_admin', // column name
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      } // type
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Users', // table name
      'is_admin' // column name
    )
  }
}
