'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Comments (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      text TEXT NOT NULL,
      user_id INT,
      restaurant_id INT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT comments_fk_user_id FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL,
      CONSTRAINT comments_fk_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE SET NULL
    )`)

    // await queryInterface.createTable('Comments', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   text: {
    //     allowNull: false,
    //     type: Sequelize.TEXT
    //   },
    //   user_id: {
    //     allowNull: false,
    //     references: {
    //       model: 'Users', // table name
    //       key: 'id' // column name
    //     },
    //     onDelete: 'SET NULL',
    //     onUpdate: 'CASCADE',
    //     type: Sequelize.INTEGER
    //   },
    //   restaurant_id: {
    //     allowNull: false,
    //     references: {
    //       model: 'Restaurants', // table name
    //       key: 'id' // column name
    //     },
    //     onDelete: 'SET NULL',
    //     onUpdate: 'CASCADE',
    //     type: Sequelize.INTEGER
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
    DROP TABLE IF EXISTS Comments`
    )

    // await queryInterface.dropTable('Comments')
  }
}
