'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DashboardSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DashboardSetting.init({
    user_id: DataTypes.INTEGER,
    panel_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'DashboardSetting',
    tableName:'dashboard_settings'
  });
  return DashboardSetting;
};