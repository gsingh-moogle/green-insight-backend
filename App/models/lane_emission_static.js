'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaneEmissionStatic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LaneEmissionStatic.init({
    region_id: DataTypes.INTEGER,
    lane_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    contributor: DataTypes.DECIMAL(10,1)
  }, {
    sequelize,
    modelName: 'LaneEmissionStatic',
    tableName:'lane_emission_statics',
  });

  LaneEmissionStatic.associate = function(models) {
    LaneEmissionStatic.belongsTo(models.Region, {
      foreignKey: 'region_id'
    });
    LaneEmissionStatic.belongsTo(models.Lane, {
      foreignKey: 'lane_id'
    });
  };
  return LaneEmissionStatic;
};