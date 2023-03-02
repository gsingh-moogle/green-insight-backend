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
      DecarbRecommendation.belongsTo(models.Project, {
        foreignKey: 'decarb_id',
      });
    }
  }
  DecarbRecommendation.init({
    region_id:DataTypes.INTEGER,
    decarb_id:DataTypes.STRING,
    lane_name: DataTypes.STRING,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    LOB: DataTypes.STRING,
    fuel_type: DataTypes.STRING,
    emissions: DataTypes.STRING,
    date: DataTypes.DATE,
    grs_wgt_qty: DataTypes.STRING,
    loaded_miles: DataTypes.STRING,
    uploaded_miles: DataTypes.STRING,
    mpg: DataTypes.STRING,
    fuel_use: DataTypes.STRING,
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
  // DecarbRecommendation.associate = function(models) {
  //   DecarbRecommendation.belongsTo(models.Project, {
  //     foreignKey: 'decarb_id',
  //   });
  // };
  return DecarbRecommendation;
};