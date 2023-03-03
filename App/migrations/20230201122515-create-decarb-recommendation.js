'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('decarb_recommendations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lane_name: {
        type: Sequelize.INTEGER
      },
      origin: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      LOB: {
        type: Sequelize.STRING
      },
      fuel_type: {
        type: Sequelize.STRING
      },
      emissions: {
        type: Sequelize.FLOAT
      },
      date: {
        type: Sequelize.DATE
      },
      grs_wgt_qty: {
        type: Sequelize.STRING
      },
      loaded_miles: {
        type: Sequelize.FLOAT
      },
      uploaded_miles: {
        type: Sequelize.FLOAT
      },
      mpg: {
        type: Sequelize.FLOAT
      },
      fuel_use: {
        type: Sequelize.FLOAT
      },
      type: {
        type: Sequelize.ENUM
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
    await queryInterface.dropTable('decarb_recommendations');
  }
};