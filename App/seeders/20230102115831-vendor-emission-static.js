'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let company_level_type = ['company_level','company_level','now'];
    let trarget_level_type = ['1','2','3','4','1','2','3','4','0','2'];
    let yearData = ['2017-01-01T00:00:00.000Z','2018-01-01T00:00:00.000Z','2019-01-01T00:00:00.000Z','2020-01-01T00:00:00.000Z','2021-01-01T00:00:00.000Z','2022-01-01T00:00:00.000Z'];
    let yearDataArray = [[
      ['2017-01-01T00:00:00.000Z','2017-03-31T00:00:00.000Z'],
      ['2017-04-01T00:00:00.000Z','2017-06-31T00:00:00.000Z'],
      ['2017-07-01T00:00:00.000Z','2017-09-31T00:00:00.000Z'],
      ['2017-10-01T00:00:00.000Z','2017-12-31T00:00:00.000Z'],
    ],[
      ['2018-01-01T00:00:00.000Z','2018-03-31T00:00:00.000Z'],
      ['2018-04-01T00:00:00.000Z','2018-06-31T00:00:00.000Z'],
      ['2018-07-01T00:00:00.000Z','2018-09-31T00:00:00.000Z'],
      ['2018-10-01T00:00:00.000Z','2018-12-31T00:00:00.000Z'],
    ],[
      ['2019-01-01T00:00:00.000Z','2019-03-31T00:00:00.000Z'],
      ['2019-04-01T00:00:00.000Z','2019-06-31T00:00:00.000Z'],
      ['2019-07-01T00:00:00.000Z','2019-09-31T00:00:00.000Z'],
      ['2019-10-01T00:00:00.000Z','2019-12-31T00:00:00.000Z'],
    ],[
      ['2020-01-01T00:00:00.000Z','2020-03-31T00:00:00.000Z'],
      ['2020-04-01T00:00:00.000Z','2020-06-31T00:00:00.000Z'],
      ['2020-07-01T00:00:00.000Z','2020-09-31T00:00:00.000Z'],
      ['2020-10-01T00:00:00.000Z','2020-12-31T00:00:00.000Z'],
    ],[
      ['2021-01-01T00:00:00.000Z','2021-03-31T00:00:00.000Z'],
      ['2021-04-01T00:00:00.000Z','2021-06-31T00:00:00.000Z'],
      ['2021-07-01T00:00:00.000Z','2021-09-31T00:00:00.000Z'],
      ['2021-10-01T00:00:00.000Z','2021-12-31T00:00:00.000Z'],
    ],[
      ['2022-01-01T00:00:00.000Z','2022-03-31T00:00:00.000Z'],
      ['2022-04-01T00:00:00.000Z','2022-06-31T00:00:00.000Z'],
      ['2022-07-01T00:00:00.000Z','2022-09-31T00:00:00.000Z'],
      ['2022-10-01T00:00:00.000Z','2022-12-31T00:00:00.000Z'],
    ]];
   
    let emission_intensity = [2,3,4,5,3.5,2.5];
    let regions = [1,1,2,2,3,3,4,4,5,5,6,6];
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            let staticData = [emission_intensity[j]];
            let emissioData = emission_intensity[j];
          for (let q = 0; q < 4; q++) {
            
            if(q == 0) {
              emissioData = emissioData;
            } else {
              emissioData = staticData[q-1]-staticData[q-1]*(10/100);
              staticData.push(emissioData);
            }
            data.push({
              region_id:i+1,
              vendor_id:faker.datatype.number({ min: 1, max: 10 }),
              date: faker.date.between(yearDataArray[j][q][0], yearDataArray[j][q][1]),
              contributor: emissioData,
              createdAt:faker.date.between(),
              updatedAt:faker.date.between()
            })
          }
        }
      }
      await queryInterface.bulkInsert('vendor_emission_statics', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('vendor_emission_statics', null, {});
  }
};
