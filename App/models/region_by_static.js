'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RegionByStatic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RegionByStatic.init({
    region_id: DataTypes.INTEGER,
    region_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RegionByStatic',
    tableName: 'region_by_statics'
  });
  return RegionByStatic;
};