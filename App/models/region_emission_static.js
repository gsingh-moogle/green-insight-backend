'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegionEmissionStatic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegionEmissionStatic.init({
    region_id: DataTypes.INTEGER,
    region_by:DataTypes.INTEGER,
    date: DataTypes.DATE,
    contributor: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'RegionEmissionStatic',
    tableName:'region_emission_statics'
  });
  RegionEmissionStatic.associate = function(models) {
    RegionEmissionStatic.belongsTo(models.RegionByStatic, {
      foreignKey: 'region_by'
    });
  };
  return RegionEmissionStatic;
};