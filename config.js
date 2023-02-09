const { query } = require("express");
let mysql=require('mysql');
require('dotenv').config();

let config = mysql.createConnection( {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD
  });

  config.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
});
  
  
  module.exports = config;
  