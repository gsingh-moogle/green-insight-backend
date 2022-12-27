'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'company',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'NO ACTION'
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
      co2_emission: {
        type: Sequelize.FLOAT
      },
      emission_target_reduction: {
        type: Sequelize.INTEGER
      },
      emission_reduction: {
        type: Sequelize.INTEGER
      },
      project_in_progress: {
        type: Sequelize.INTEGER
      },
      gap_to_target: {
        type: Sequelize.INTEGER
      },
      company_level : {
        type: Sequelize.INTEGER
      },
      target_level: {
        type: Sequelize.INTEGER
      },
      base_level: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('company_data');
  }
};