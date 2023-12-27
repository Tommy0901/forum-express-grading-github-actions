'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Users
    ADD COLUMN image VARCHAR(255) AFTER is_admin`
    )

    // await queryInterface.addColumn(
    //   'Users', // table name
    //   'image', // column name
    //   { type: Sequelize.STRING } // type
    // )
    // await queryInterface.sequelize.query('ALTER TABLE Users MODIFY COLUMN image VARCHAR(255) AFTER is_admin;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Users
    DROP COLUMN image`
    )

    // await queryInterface.removeColumn(
    //   'Users', // table name
    //   'image' // column name
    // )
  }
}
