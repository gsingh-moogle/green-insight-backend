'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmissionIntensity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmissionIntensity.init({
    region_id: DataTypes.INTEGER,
    year: DataTypes.DATE,
    emission_revenue: DataTypes.DECIMAL(10,2),
    emission_tons: DataTypes.DECIMAL(10,2),
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'EmissionIntensity',
    tableName: 'emission_intensities'
  });

  EmissionIntensity.associate = function(models) {
    EmissionIntensity.belongsTo(models.Region, {
      foreignKey: 'region_id'
    });
  };
  return EmissionIntensity;
};