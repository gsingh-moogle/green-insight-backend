'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lane.init({
    user_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    facilities_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    location: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Lane',
    tableName:'lanes'
  });

  Lane.associate = function(models) {
    Lane.hasOne(models.User, {
      foreignKey: 'id'
    });
  };
  return Lane;
};