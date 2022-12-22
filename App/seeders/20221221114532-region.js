'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let arrayValues = ['region','facilities','vendor','lane'];
      for (let i = 0; i < 100; i++) {
          data.push({
              user_id: faker.datatype.number({ min: 1, max: 100 }),
              name: faker.address.cityName(),
              latitude:faker.address.latitude(),
              longitude:faker.address.longitude(),
              location:faker.address.county(),
              status:'1',
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('regions', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('regions', null, {});
  }
};
