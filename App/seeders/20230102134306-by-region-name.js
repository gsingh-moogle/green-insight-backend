'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let regionName = ['Pacific','Southwest','South','Midwest','Mountains','Northeast','Central','Southwest'];
      for (let i = 0; i < 8; i++) {
          data.push({
              region_id: faker.datatype.number({ min: 1, max: 6 }),
              region_name: regionName[i],
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('region_by_statics', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('region_by_statics', null, {});
  }
};
