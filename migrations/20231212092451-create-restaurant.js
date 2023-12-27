'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Restaurants (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      tel VARCHAR(255) NOT NULL,
      opening_hours VARCHAR(255),
      description TEXT,
      address VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)

    // await queryInterface.createTable('Restaurants', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   name: {
    //     allowNull: false,
    //     type: Sequelize.STRING
    //   },
    //   tel: {
    //     allowNull: false,
    //     type: Sequelize.STRING
    //   },
    //   opening_hours: {
    //     type: Sequelize.STRING
    //   },
    //   description: {
    //     type: Sequelize.TEXT
    //   },
    //   address: {
    //     allowNull: false,
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
    DROP TABLE IF EXISTS Restaurants`
    )

    // await queryInterface.dropTable('Restaurants')
  }
}
