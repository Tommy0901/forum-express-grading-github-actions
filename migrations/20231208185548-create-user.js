'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      name VARCHAR NOT NULL,
      email VARCHAR UNIQUE NOT NULL,
      password VARCHAR NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    )`)

    // await queryInterface.createTable('Users', {
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
    //   email: {
    //     allowNull: false,
    //     unique: true,
    //     type: Sequelize.STRING
    //   },
    //   password: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    DROP TABLE IF EXISTS Users`
    )

    // await queryInterface.dropTable('Users')
  }
}
