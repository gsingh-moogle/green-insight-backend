const helper=require("../helper/api-response");
const Sequelize = require("sequelize");
let sequelize;
const createConnection= async (req, res, next) => {
    try {
        sequelize = new Sequelize(
            'green_sight_pepsico',
            'root',
            '',
            {
              dialect: "mysql",
              host: '127.0.0.1',
            }
          );
          req.dynamicConnection = sequelize;
          next();
    } catch (err) {
      console.log('__________________________________________',err);
      return helper.unAuthorizedResponse(res, 'Dynamic connection established!')
    }
  }

  module.exports = { createConnection };