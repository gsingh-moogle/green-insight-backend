'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let arrayValues = ['region','facilities','vendor','lane'];
      for (let i = 0; i < 100; i++) {
          data.push({
              emission_type: arrayValues[faker.datatype.number({ min: 0, max: 3 })],
              region_id: faker.datatype.number({ min: 1, max: 10 }),
              facilities_id: faker.datatype.number({ min: 1, max: 10 }),
              vendor_id: faker.datatype.number({ min: 1, max: 10 }),
              lane_id: faker.datatype.number({ min: 1, max: 10 }),
              gap_to_target: faker.datatype.number({ min: 10, max: 100 }),
              intensity:faker.datatype.number({ min: 100, max: 1000, precision: 0.01 }),
              cost:faker.datatype.number({ min: 100, max: 10000, precision: 0.01 }),
              service:faker.datatype.number(500),
              currency:'$',
              date: faker.date.between('2022-01-01T00:00:00.000Z', '2022-12-01T00:00:00.000Z'),
              emission_toggle:1,
              detractor:faker.datatype.number({ min: 10, max: 1000, precision: 0.01 }),
              contributor:faker.datatype.number({ min: 10, max: 1000, precision: 0.01 }),
              status:1,
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('emissions', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emissions', null, {});
  }
};