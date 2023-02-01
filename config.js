const { query } = require("express");
let mysql=require('mysql');

let config = mysql.createConnection( {
  host: "localhost",
  user: "root",
  password: "root1234",
  database:"mydb"
  });

  
  
  module.exports = config;
  