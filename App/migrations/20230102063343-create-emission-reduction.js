'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emission_reductions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      region_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM,
        values:['company_level','target_level','now']
      },
      year: {
        type: Sequelize.DATE
      },
      quater1: {
        type: Sequelize.INTEGER
      },
      quater2: {
        type: Sequelize.INTEGER
      },
      quater3: {
        type: Sequelize.INTEGER
      },
      quater4: {
        type: Sequelize.INTEGER
      },
      now: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('emission_reductions');
  }
};