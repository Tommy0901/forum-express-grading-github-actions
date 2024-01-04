'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Favorites (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      user_id INT NOT NULL,
      restaurant_id INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT favorites_fk_user_id FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
      CONSTRAINT favorites_fk_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE
    )`)

    // await queryInterface.createTable('Favorites', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   user_id: {
    //     allowNull: false,
    //     type: Sequelize.INTEGER
    //   },
    //   restaurant_id: {
    //     allowNull: false,
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
    DROP TABLE IF EXISTS Favorites`
    )

    // await queryInterface.dropTable('Favorites')
  }
}
