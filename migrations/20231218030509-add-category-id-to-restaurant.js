'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Restaurants', // table name
      'category_id', // column name
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories', // table name
          key: 'id' // column name
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      } // type
    )
    await queryInterface.sequelize.query('ALTER TABLE restaurants MODIFY COLUMN category_id INT(11) AFTER image;')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Restaurants', // table name
      'category_id' // column name
    )
  }
}
