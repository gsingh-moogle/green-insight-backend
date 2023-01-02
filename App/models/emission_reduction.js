'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmissionReduction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmissionReduction.init({
    name: DataTypes.STRING,
    region_id:DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      values:['company_level','target_level','now']
    },
    quater1: DataTypes.INTEGER,
    quater2: DataTypes.INTEGER,
    quater3: DataTypes.INTEGER,
    quater4: DataTypes.INTEGER,
    now: DataTypes.INTEGER,
    year: DataTypes.DATE,
    emission: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'EmissionReduction',
    tableName:'emission_reductions'
  });
  return EmissionReduction;
};