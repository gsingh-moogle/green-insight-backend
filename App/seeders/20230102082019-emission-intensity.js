'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let company_level_type = ['company_level','company_level','now'];
    let trarget_level_type = ['1','2','3','4','1','2','3','4','0','2'];
    let year = ['2017-01-01T00:00:00.000Z','2018-01-01T00:00:00.000Z','2019-01-01T00:00:00.000Z','2020-01-01T00:00:00.000Z','2021-01-01T00:00:00.000Z','2022-01-01T00:00:00.000Z',];
    let emission_intensity = [2.25,2.31,2.40,2.51,2.68,2.79];
    let regions = [1,1,2,2,3,3,4,4,5,5,6,6];
      for (let i = 0; i < 6; i++) {
          data.push({
            region_id:i+1,
            year: year[i],
            emission_intensity: emission_intensity[i],
            createdAt:faker.date.between(),
            updatedAt:faker.date.between()
          })
      }
      await queryInterface.bulkInsert('emission_intensities', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emission_intensities', null, {});
  }
};
