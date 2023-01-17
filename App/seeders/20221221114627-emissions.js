'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let arrayValues = ['region','facilities','vendor','lane'];
      for (let i = 0; i < 3000; i++) {
          let from = faker.address.cityName();
          let to = faker.address.cityName();
          let emission = faker.datatype.number({ min: 0, max: 1000, precision: 0.01 });
          let emission_per_ton = faker.datatype.number({ min: 0, max: 10, precision: 0.01 });
          let intensity = (emission/emission_per_ton).toFixed(2);
          data.push({
              company_id: 1,
              name : `${from}-${to}`,
              from: from,
              to: to,
              region_id: faker.datatype.number({ min: 1, max: 6 }),
              facilities_id: faker.datatype.number({ min: 1, max: 10 }),
              vendor_id: faker.datatype.number({ min: 1, max: 10 }),
              lane_id: faker.datatype.number({ min: 1, max: 10 }),
              emission:emission,
              emission_per_ton: emission_per_ton,
              platform :'static',
              intensity:intensity,
              date: faker.date.between('2017-01-01T00:00:00.000Z', '2022-12-01T00:00:00.000Z'),
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