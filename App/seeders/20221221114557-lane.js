'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let arrayValues = ['region','facilities','vendor','lane'];
    let laneValues = ['Riverside-Fort Worth','Riverside-Chicago','Riverside-Phoenix','Tacoma-Chicago','El Segundo-Phoenix','Tacoma-Portland','Riverside-Milwaukee','Tacoma-Spokane',faker.address.cityName(),faker.address.cityName()];
      for (let i = 0; i < 10; i++) {
          data.push({
              user_id: faker.datatype.number({ min: 1, max: 10 }),
              name: laneValues[i],
              region_id: faker.datatype.number({ min: 1, max: 6 }),
              facilities_id: faker.datatype.number({ min: 1, max: 10 }),
              latitude:faker.address.latitude(),
              longitude:faker.address.longitude(),
              location:faker.address.county(),
              status:'1',
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('lanes', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('lanes', null, {});
  }
};
