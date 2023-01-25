'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let company_level_type = ['company_level','target_level','company_level','target_level','company_level','target_level','company_level','target_level','company_level','target_level','company_level','target_level',];
    let region_id = ['1','1','2','2','3','3','4','4','5','5','6','6'];
    let quater1 = [1900,1500,2400,2100,2500,2300,1900,1500,2400,2100,2500,2300];
    let quater2 = [1600,1200,2200,1800,2300,2100,1600,1200,2200,1800,2300,2100];
    let quater3 = [1200,900,1800,1600,2100,1800,1200,900,1800,1600,2100,1800];
    let quater4 = [900,600,1600,1300,1800,1600,900,600,1600,1300,1800,1600];
    let now = [1100,1100,1500,1500,2000,2000,1100,1100,1500,1500,2000,2000];
      for (let i = 0; i < 12; i++) {
          data.push({
            name: company_level_type[i],
            region_id:region_id[i],
            type: company_level_type[i],
            quater1: quater1[i],
            quater2: quater2[i],
            quater3: quater3[i],
            quater4: quater4[i],
            now: now[i],
            year: faker.date.between(),
            createdAt:faker.date.between(),
            updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('emission_reductions', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emission_reductions', null, {});
  }
};
