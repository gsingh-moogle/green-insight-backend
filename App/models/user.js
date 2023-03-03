'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name:{
      type:DataTypes.STRING
    },
    email: {
      type:DataTypes.STRING
    },
    password: {
      type:DataTypes.STRING
    },
    role: {
      type:DataTypes.INTEGER,
      comment:'0 => substain login, 1 => region login'
    },
    company_id: {
      type:DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName:'users'
  });
  User.associate = function(models) {
    User.hasOne(models.Region, {
      foreignKey: 'user_id'
    });
    User.hasOne(models.Profile, {
      foreignKey: 'user_id'
    });
    User.belongsTo(models.Company, {
      foreignKey: 'company_id'
    });
  };
  return User;
};