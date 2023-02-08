const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect:'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  });

  // try {
  //    sequelize.authenticate();
  //   console.log('Connection has been established successfully.');
  // } catch (error) {
  //   console.error('Unable to connect to the database:', error);
  // }

  const db={};
  db.Sequelize=Sequelize;
  db.sequelize=sequelize;

db.user=require('../models/user')(sequelize,DataTypes)
db.product=require('../models/product')(sequelize,DataTypes)
// db.sequelize.sync({force:true})

  module.exports=db