'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let company_level_type = ['company_level','company_level','now'];
    let trarget_level_type = ['1','2','3','4','1','2','3','4','0','2'];
    let year = ['2017-01-01T00:00:00.000Z','2018-01-01T00:00:00.000Z','2019-01-01T00:00:00.000Z','2020-01-01T00:00:00.000Z','2021-01-01T00:00:00.000Z','2022-01-01T00:00:00.000Z'];
  //  let emission_intensity = [350,150,100,75,60,45];
    let emission_intensity = [45,60,75,100,150,350];
    let regions = [1,1,2,2,3,3,4,4,5,5,6,6];
      for (let i = 0; i < 6; i++) {
        let staticData = [emission_intensity[i]];
        let emissioData = emission_intensity[i];
        for (let j = 0; j < 6; j++) {
          
          if(j == 0) {
            emissioData = emissioData;
          } else {
            emissioData = staticData[j-1]-staticData[j-1]*(10/100);
            staticData.push(emissioData);
          }
          data.push({
            region_id:i+1,
            date: year[j],
            intensity: emissioData,
            createdAt:faker.date.between(),
            updatedAt:faker.date.between()
          })
        }
      }
      await queryInterface.bulkInsert('emission_region_statics', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emission_region_statics', null, {});
  }
};
