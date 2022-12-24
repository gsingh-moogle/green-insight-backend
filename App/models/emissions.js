'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
class Emission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Emission.init({
    emission_type: {
      type: DataTypes.ENUM,
      values:['region','facilities','vendor','lane']
    },
    region_id: DataTypes.INTEGER,
    facilities_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER,
    lane_id: DataTypes.INTEGER,
    gap_to_target: DataTypes.INTEGER,
    intensity: DataTypes.FLOAT,
    cost: DataTypes.FLOAT,
    service: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    date: DataTypes.DATE,
    emission_toggle: DataTypes.BOOLEAN,
    detractor: DataTypes.FLOAT,
    contributor: DataTypes.FLOAT,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Emission',
    tableName:'emissions'
  });



  Emission.associate = function(models) {
    Emission.hasMany(models.Region, {
      foreignKey: 'id'
    });

    Emission.hasOne(models.Facility, {
      foreignKey: 'id'
    });

    Emission.hasOne(models.Vendor, {
      foreignKey: 'id'
    });

    Emission.hasOne(models.Lane, {
      foreignKey: 'id'
    });

    
  };
  return Emission;
};