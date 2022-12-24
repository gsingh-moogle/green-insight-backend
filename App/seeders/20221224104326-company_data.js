'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
      for (let i = 0; i < 10; i++) {
          data.push({
              company_id: i+1,
              co2_emission: faker.datatype.number({ min: 1, max: 1000 }),
              emission_target_reduction: faker.datatype.number({ min: 1, max: 100 }),
              emission_reduction: faker.datatype.number({ min: 1, max: 45 }),
              project_in_progress: faker.datatype.number({ min: 1, max: 20 }),
              gap_to_target: faker.datatype.number({ min: 1, max: 100 }),
              status: 1,
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('company_data', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('company_data', null, {});
  }
};
