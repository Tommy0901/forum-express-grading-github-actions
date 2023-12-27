'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Categories (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)

    // await queryInterface.createTable('Categories', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   name: {
    //     allowNull: false,
    //     unique: true,
    //     type: Sequelize.STRING
    //   },
    //   created_at: {
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    //     type: Sequelize.DATE
    //   },
    //   updated_at: {
    //     allowNull: false,
    //     defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    //     type: Sequelize.DATE
    //   }
    // })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TABLE IF EXISTS Categories`
    )

    // await queryInterface.dropTable('Categories')
  }
}
