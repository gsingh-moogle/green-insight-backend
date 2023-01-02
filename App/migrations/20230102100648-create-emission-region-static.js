'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emission_region_statics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'regions',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'NO ACTION'
      },
      date: {
        type: Sequelize.DATE
      },
      intensity: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('emission_region_statics');
  }
};