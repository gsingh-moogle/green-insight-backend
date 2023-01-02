'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      let userData = [];
      
      for (let i = 0; i < 100; i++) {
        let fullName = faker.name.fullName();
        let pass = faker.internet.password();
        let email = faker.internet.exampleEmail();
        if(i == 0) {
            email = 'sustainable@mooglelab.com';
            pass = '$2a$12$KlFiLz2EQv.zEaw9EU5Id.RlNfBYlN4AkzzRKpvJQ1YB8DUJj0OlG';
        }
          userData.push({
              name: fullName,
              password: pass,
              role: 0,
              email:email,
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('Users', userData, {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('Users', null, {});
  }
};
