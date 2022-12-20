'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectFeedback.init({
    project_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    rating: DataTypes.FLOAT,
    desc: DataTypes.TEXT,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ProjectFeedback',
    tableName:'project_feedbacks'
  });
  return ProjectFeedback;
};