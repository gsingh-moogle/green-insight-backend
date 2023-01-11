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
    company_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    facilities_id: DataTypes.INTEGER,
    vendor_id: {
      type:DataTypes.INTEGER
    },
    lane_id: DataTypes.INTEGER,
    gap_to_target: DataTypes.INTEGER,
    intensity: DataTypes.FLOAT,
    emission: DataTypes.FLOAT,
    truck_load: DataTypes.INTEGER,
    inter_modal: DataTypes.INTEGER,
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
    Emission.belongsTo(models.Region, {
      foreignKey: 'region_id'
    });

    Emission.belongsTo(models.Facility, {
      foreignKey: 'facilities_id'
    });

    Emission.belongsTo(models.Vendor, {
      foreignKey: 'vendor_id'
    });

    Emission.belongsTo(models.Lane, {
      foreignKey: 'lane_id',
    });

    
  };
  return Emission;
};