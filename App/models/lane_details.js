'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lane_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  lane_details.init({
    project_id: DataTypes.INTEGER,
    lane_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'lane_details',
  });
  return lane_details;
};