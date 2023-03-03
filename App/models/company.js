'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Company.init({
    name: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    db_name: DataTypes.STRING,
    logo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
    tableName:'company'
  });
  Company.associate = function(models) {
    Company.hasOne(models.CompanyData, {
      foreignKey: 'id'
    });
  };
  return Company;
};