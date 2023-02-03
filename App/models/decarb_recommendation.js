'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DecarbRecommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DecarbRecommendation.init({
    lane_name: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    LOB: DataTypes.STRING,
    fuel_type: DataTypes.STRING,
    emissions: DataTypes.FLOAT,
    date: DataTypes.DATE,
    grs_wgt_qty: DataTypes.STRING,
    loaded_miles: DataTypes.FLOAT,
    uploaded_miles: DataTypes.FLOAT,
    mpg: DataTypes.FLOAT,
    fuel_use: DataTypes.FLOAT,
    type: {
      type:DataTypes.ENUM,
      values: ['alternative_fuel', 'modal_shift']
    },
    recommended_type: {
      type:DataTypes.ENUM,
      values: ['original', 'recommended']
    }
  }, {
    sequelize,
    modelName: 'DecarbRecommendation',
    tableName: 'decarb_recommendations'
  });
  return DecarbRecommendation;
};