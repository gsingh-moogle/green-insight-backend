'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
      for (let i = 0; i < 1; i++) {
          data.push({
              company_id: i+1,
              region_id:faker.datatype.number({ min: 1, max: 6 }),
              co2_emission: faker.datatype.number({ min: 0, max: 38 }),
              emission_target_reduction: faker.datatype.number({ min: 1, max: 20 }),
              emission_reduction: faker.datatype.number({ min: 1, max: 15 }),
              project_in_progress: faker.datatype.number({ min: 1, max: 20 }),
              gap_to_target: faker.datatype.number({ min: 1, max: 25 }),
              company_level: faker.datatype.number({ min: 1, max: 5 }),
              target_level: faker.datatype.number({ min: 10, max: 35 }),
              base_level: faker.datatype.number({ min: 25, max: 35 }),
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
