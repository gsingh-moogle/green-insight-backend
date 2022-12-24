'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CompanyData.init({
    company_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    co2_emission: DataTypes.INTEGER,
    emission_target_reduction: DataTypes.INTEGER,
    emission_reduction: DataTypes.INTEGER,
    project_in_progress: DataTypes.INTEGER,
    gap_to_target: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CompanyData',
    tableName:'company_data'
  });

  CompanyData.associate = function(models) {
    CompanyData.hasOne(models.Company, {
      foreignKey: 'id'
    });
  };
  return CompanyData;
};