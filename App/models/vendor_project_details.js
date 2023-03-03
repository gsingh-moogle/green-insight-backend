'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vendor_project_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  vendor_project_details.init({
    project_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'vendor_project_details',
  });
  return vendor_project_details;
};