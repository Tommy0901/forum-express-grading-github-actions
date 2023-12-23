'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Restaurants
    ADD COLUMN category_id INT NOT NULL AFTER image,
    ADD CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES Categories(id) ON UPDATE CASCADE`
    )

    // await queryInterface.addColumn(F
    //   'Restaurants', // table name
    //   'category_id', // column name
    //   {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'Categories', // table name
    //       key: 'id' // column name
    //     },
    //     onDelete: 'RESTRICT',
    //     onUpdate: 'CASCADE'
    //   } // type
    // )
    // await queryInterface.sequelize.query('ALTER TABLE Restaurants MODIFY COLUMN category_id INT NOT NULL AFTER image;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TABLE Restaurants
    DROP FOREIGN KEY fk_category_id,
    DROP COLUMN category_id`
    )

    // await queryInterface.removeColumn(
    //   'Restaurants', // table name
    //   'category_id' // column name
    // )
  }
}
