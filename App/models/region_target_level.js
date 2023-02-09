'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegionTargetLevel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegionTargetLevel.init({
    region_id:DataTypes.INTEGER,
    region_name:DataTypes.STRING,
    target_level: DataTypes.FLOAT,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RegionTargetLevel',
    tableName:'region_target_level'
  });
  return RegionTargetLevel;
};