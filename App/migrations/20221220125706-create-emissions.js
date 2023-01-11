'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emission_type: {
        type: Sequelize.ENUM,
        values:['region','facilities','vendor','lane']
      },
      company_id: {
        type: Sequelize.INTEGER,
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'regions',
          key:'id'
        },
        onDelete:'CASCADE',
        allowNull: false,
        onUpdate:'NO ACTION'
      },
      facilities_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'facilities',
          key:'id'
        },
        onDelete:'CASCADE',
        allowNull: false,
        onUpdate:'NO ACTION'
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'vendors',
          key:'id'
        },
        onDelete:'CASCADE',
        allowNull: false,
        onUpdate:'NO ACTION'
      },
      lane_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'lanes',
          key:'id'
        },
        onDelete:'CASCADE',
        allowNull: false,
        onUpdate:'NO ACTION'
      },
      gap_to_target: {
        type: Sequelize.INTEGER
      },
      intensity: {
        type: Sequelize.FLOAT
      },
      emission: {
        type: Sequelize.FLOAT
      },
      truck_load: {
        type: Sequelize.INTEGER
      },
      inter_modal: {
        type: Sequelize.INTEGER
      },
      cost: {
        type: Sequelize.FLOAT
      },
      service: {
        type: Sequelize.FLOAT
      },
      currency: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      emission_toggle: {
        type: Sequelize.BOOLEAN
      },
      detractor: {
        type: Sequelize.FLOAT
      },
      contributor: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('emissions');
  }
};