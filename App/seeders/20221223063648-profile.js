'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
      for (let i = 0; i < 100; i++) {
          data.push({
              user_id: i+1,
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
              image: faker.image.avatar(),
              role: 1,
              status: 1,
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('profiles', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};
