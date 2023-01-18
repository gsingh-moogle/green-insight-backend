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
<<<<<<< HEAD
              gap_to_target: faker.datatype.number({ min: 0, max: 10 }),
              intensity:faker.datatype.number({ min: 0, max: 25, precision: 0.01 }),
              emission:faker.datatype.number({ min: 0, max: 25, precision: 0.01 }),
              truck_load:faker.datatype.number({ min: 10, max: 25}),
              inter_modal:faker.datatype.number({ min: 10, max: 35}),
              cost:faker.datatype.number({ min: 0, max: 10, precision: 0.01 }),
              service:faker.datatype.number({ min: 0, max: 30, precision: 0.01 }),
              currency:'$',
              date: faker.date.between('2022-01-01T00:00:00.000Z', '2022-12-01T00:00:00.000Z'),
              emission_toggle:1,
              detractor:faker.datatype.number({ min: 1, max: 3}),
              contributor:faker.datatype.number({ min: 1, max: 3 }),
=======
              emission:emission,
              total_ton_miles: emission_per_ton,
              platform :'static',
              intensity:intensity,
              date: faker.date.between('2017-01-01T00:00:00.000Z', '2022-12-01T00:00:00.000Z'),
>>>>>>> 42ff5405c69b6196ad5edacdd797014b52fd64b4
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