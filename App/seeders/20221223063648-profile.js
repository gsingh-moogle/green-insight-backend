'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let firstNameArray=['Chris','Annette'];
    let lastNameArray=['Cassell','Block'];
    let imageArray=['/images/chris_cassell.jpeg','/images/1144.jpg'];
    let roleArray=[0,1];
      for (let i = 0; i < 2; i++) {
          data.push({
              user_id: i+1,
              first_name: firstNameArray[i],
              last_name: lastNameArray[i],
              image: imageArray[i],
              role: roleArray[i],
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
