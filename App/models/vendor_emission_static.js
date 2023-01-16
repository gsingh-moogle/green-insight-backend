'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorEmissionStatic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VendorEmissionStatic.init({
    region_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    lane_id:DataTypes.INTEGER,
    date: DataTypes.DATE,
    contributor: DataTypes.DECIMAL(10,1)
  }, {
    sequelize,
    modelName: 'VendorEmissionStatic',
    tableName: 'vendor_emission_statics',
  });
  VendorEmissionStatic.associate = function(models) {
    VendorEmissionStatic.belongsTo(models.Region, {
      foreignKey: 'region_id'
    });
    VendorEmissionStatic.belongsTo(models.Facility, {
      foreignKey: 'vendor_id'
    });
    VendorEmissionStatic.hasOne(models.Lane, {
      foreignKey: 'lane_id'
    });
  };
  return VendorEmissionStatic;
};