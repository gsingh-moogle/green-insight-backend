'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    country_code:DataTypes.STRING,
    phone_number: DataTypes.STRING,
    image: DataTypes.STRING,
    role: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Profile',
    tableName:'profiles'
  });
  return Profile;
};