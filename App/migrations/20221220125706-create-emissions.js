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
      name: {
        type: Sequelize.STRING,
      },
      from: {
        type: Sequelize.STRING,
      },
      to: {
        type: Sequelize.STRING,
      },
      company_id: {
        type: Sequelize.INTEGER,
      },
      region_name: {
        type: Sequelize.STRING,
        allowNull:true,
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'regions',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'NO ACTION'
      },
      facilities_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'facilities',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'NO ACTION'
      },
      lane_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'lanes',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'NO ACTION'
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:'vendors',
          key:'id'
        },
        onDelete:'CASCADE',
        onUpdate:'NO ACTION'
      },
      emission: {
        type: Sequelize.FLOAT
      },
      intensity: {
        type: Sequelize.FLOAT
      },
      total_ton_miles: {
        type: Sequelize.FLOAT
      },
      loaded_ton_miles: {
        type: Sequelize.FLOAT
      },
      shipments: {
        type: Sequelize.STRING
      },
      platform: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull:true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull:true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('emissions');
  }
};