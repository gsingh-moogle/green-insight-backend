'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    project_unique_id : DataTypes.STRING,
    region_id: DataTypes.INTEGER,
    manager_id: DataTypes.INTEGER,
    project_name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    desc: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    type: {
      type:DataTypes.ENUM,
      values: ['alternative_fuel', 'modal_shift']
    },
  }, {
    sequelize,
    modelName: 'Project',
    tableName:'projects'
  });
  return Project;
};