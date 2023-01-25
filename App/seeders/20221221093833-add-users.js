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
        let role = 1;
        if(i == 0) {
            fullName = 'Chris Cassell';
            email = 'chris.cassell@lowes.com';
            pass = '$2a$12$5kgPtE9x4tlFQoSl9Zh6Gur2nPI9o0Vel9okpp7UjBQeYJ5CXcl7y';
            role = 0;
        } else if(i == 1) {
            fullName = 'Annette Block';
            email = 'annette.block@lowes.com';
            pass = '$2a$12$K4Tg58kkj.WwNw8Vf8e.HOruthoGXaXExbMec/QBzfbB9b3IxNGYO';
        }
          userData.push({
              name: fullName,
              password: pass,
              role: role,
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
