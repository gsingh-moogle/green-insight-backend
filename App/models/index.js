'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json');
const db = {};
const databases = Object.keys(config.databases);

let sequelize;
for(let i = 0; i < databases.length; ++i) {
  let database = databases[i];
  let dbPath = config.databases[database];
  db[database] = new Sequelize( dbPath.database, dbPath.username, dbPath.password, dbPath );
  //Add models from database1 folder
// console.log('db[database]',db[database]);
// return false;
  fs.readdirSync(__dirname)
  .filter(file =>(file.indexOf('.') !== 0) && (file !== basename) &&(file.slice(-3) === '.js'))
    .forEach(file => {
    const model = require(path.join(__dirname, file))(db[database], Sequelize.DataTypes)
    db[database][model.name] = model; 
  });
}

for(let i = 0; i < databases.length; ++i) {
  Object.keys(db[databases[i]]).forEach(modelName => {
    if (db[databases[i]][modelName].associate) {
      db[databases[i]][modelName].associate(db[databases[i]]);
    }
  });
}

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
module.exports = db;
