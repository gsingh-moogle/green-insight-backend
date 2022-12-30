'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let arrayValues = ['region','facilities','vendor','lane'];
      for (let i = 0; i < 2000; i++) {
          data.push({
              emission_type: arrayValues[faker.datatype.number({ min: 0, max: 3 })],
              company_id: faker.datatype.number({ min: 1, max: 10 }),
              region_id: faker.datatype.number({ min: 1, max: 6 }),
              facilities_id: faker.datatype.number({ min: 1, max: 6 }),
              vendor_id: faker.datatype.number({ min: 1, max: 6 }),
              lane_id: faker.datatype.number({ min: 1, max: 6 }),
              gap_to_target: faker.datatype.number({ min: 0, max: 25 }),
              intensity:faker.datatype.number({ min: 0, max: 40, precision: 0.01 }),
              truck_load:faker.datatype.number({ min: 10, max: 25}),
              inter_modal:faker.datatype.number({ min: 10, max: 35}),
              cost:faker.datatype.number({ min: 0, max: 30, precision: 0.01 }),
              service:faker.datatype.number({ min: 0, max: 60, precision: 0.01 }),
              currency:'$',
              date: faker.date.between('2017-01-01T00:00:00.000Z', '2022-12-01T00:00:00.000Z'),
              emission_toggle:1,
              detractor:faker.datatype.number({ min: 0, max: 45}),
              contributor:faker.datatype.number({ min: 10, max: 60 }),
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