'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
      for (let i = 0; i < 1; i++) {
          data.push({
              name: faker.company.name(),
              status: 1,
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('company', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('company', null, {});
  }
};
