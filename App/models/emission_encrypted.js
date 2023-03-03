'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
class EmissionEncrypted extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmissionEncrypted.init({
    name : DataTypes.STRING,
    source : DataTypes.STRING,
    destination : DataTypes.STRING,
    region_name: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    region_id: DataTypes.INTEGER,
    facilities_id: DataTypes.INTEGER,
    lane_id: DataTypes.INTEGER,
    vendor_id: {
      type:DataTypes.INTEGER
    },
    emission: DataTypes.FLOAT,
    intensity: DataTypes.FLOAT,
    total_ton_miles: DataTypes.FLOAT,
    loaded_ton_miles: DataTypes.FLOAT,
    shipments:DataTypes.STRING,
    platform: DataTypes.FLOAT,
    date: DataTypes.DATE,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'EmissionEncrypted',
    tableName:'emissions_encrypted'
  });



  EmissionEncrypted.associate = function(models) {
    EmissionEncrypted.belongsTo(models.Region, {
      foreignKey: 'region_id'
    });

    EmissionEncrypted.belongsTo(models.Facility, {
      foreignKey: 'facilities_id'
    });

    EmissionEncrypted.belongsTo(models.Vendor, {
      foreignKey: 'vendor_id'
    });

    EmissionEncrypted.belongsTo(models.Lane, {
      foreignKey: 'lane_id',
    });

    
  };
  return EmissionEncrypted;
};