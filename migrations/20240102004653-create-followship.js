'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE IF NOT EXISTS Followships (
      id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
      follower_id INT NOT NULL,
      following_id INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT followships_likes_fk_follower_id FOREIGN KEY (follower_id) REFERENCES Users(id) ON DELETE CASCADE,
      CONSTRAINT followships_fk_following_id FOREIGN KEY (following_id) REFERENCES Users(id) ON DELETE CASCADE
    )`)

    // await queryInterface.createTable('Followships', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   follower_id: {
    //     type: Sequelize.INTEGER
    //   },
    //   following_id: {
    //     type: Sequelize.INTEGER
    //   },
    //   created_at: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updated_at: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    DROP TABLE IF EXISTS Followships`
    )

    // await queryInterface.dropTable('Followships')
  }
}
