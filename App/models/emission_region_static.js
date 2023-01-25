'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmissionRegionStatic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmissionRegionStatic.init({
    region_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    intensity: DataTypes.DECIMAL(10,1)
  }, {
    sequelize,
    modelName: 'EmissionRegionStatic',
    tableName: 'emission_region_statics',
  });
  EmissionRegionStatic.associate = function(models) {
    EmissionRegionStatic.belongsTo(models.Region, {
      foreignKey: 'region_id'
    });
  };
  return EmissionRegionStatic;
};