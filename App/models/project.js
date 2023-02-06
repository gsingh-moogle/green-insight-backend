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
    decarb_id: {
          type:DataTypes.STRING,
          references: 'decarb_recommendations', // <<< Note, its table's name, not object name
          referencesKey: 'decarb_id' // <<< Note, its a column name
    },
    manager_id: DataTypes.INTEGER,
    project_name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    desc: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    customize_emission:DataTypes.FLOAT,
    emission_percent:DataTypes.FLOAT,
    actual_emission:DataTypes.FLOAT,
    type: {
      type:DataTypes.ENUM,
      values: ['alternative_fuel', 'modal_shift']
    },
  }, {
    sequelize,
    modelName: 'Project',
    tableName:'projects'
  });

  Project.associate = function(models) {
    Project.hasMany(models.DecarbRecommendation, {
      foreignKey: 'decarb_id',
    });
  };
  return Project;
};