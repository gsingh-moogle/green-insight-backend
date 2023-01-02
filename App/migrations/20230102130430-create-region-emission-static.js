'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('region_emission_statics', {
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
      region_by:{
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE
      },
      contributor: {
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
    await queryInterface.dropTable('region_emission_statics');
  }
};