'use strict';
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [];
    let company_level_type = ['company_level','company_level','now'];
    let trarget_level_type = ['1','2','3','4','1','2','3','4','0','2'];
    let year = ['2017-01-01T00:00:00.000Z','2018-01-01T00:00:00.000Z','2019-01-01T00:00:00.000Z','2020-01-01T00:00:00.000Z','2021-01-01T00:00:00.000Z','2022-01-01T00:00:00.000Z',];
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
    let emission_intensity = [
      [0.39,0.5,0.5,1.5],
      [0.29,0.2,0.5,1],
      [0.4,0.6,1,1],
      [0.5,0.2,0.8,1],
      [0.2,0.4,0.8,1.2],
      [0.4,0.6,0.7,1]];
    let emission_tons = [
      [60,50,40,38],
      [56,47,38,35],
      [54,45,36,32],
      [53,44,35,30],
      [51,42,32,27],
      [50,40,30.5,25]];
    let regions = [1,1,2,2,3,3,4,4,5,5,6,6];
    for (let k = 0; k < 6; k++) {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
          data.push({
            region_id:k+1,
            year: year[i],
            emission_revenue: emission_intensity[i][j],
            emission_tons: emission_tons[i][j],
            date: faker.date.between(yearDataArray[i][j][0], yearDataArray[i][j][1]),
            createdAt:faker.date.between(),
            updatedAt:faker.date.between()
          })
        }
      }
    }
      await queryInterface.bulkInsert('emission_intensities', data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('emission_intensities', null, {});
  }
};
