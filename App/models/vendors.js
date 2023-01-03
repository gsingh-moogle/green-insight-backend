'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendor.init({
    user_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    facilities_id: DataTypes.INTEGER,
    lane_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    location: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Vendor',
    tableName:'vendors'
  });
  Vendor.associate = function(models) {
    Vendor.hasOne(models.User, {
      foreignKey: 'id'
    });
  };
  return Vendor;
};