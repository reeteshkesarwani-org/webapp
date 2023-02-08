var mysql = require('mysql');
var express=require('express');
const routes = require('./routes/routes');
var app1=express()
app1.use(express.json())
const config=require('./config');
require('dotenv').config();
var db=require('./configuration/sequelize')
const product=require('./models/user')
var app=require('./demo_db_connection')


 let databaseName = process.env.DATABASE_NAME ;

// product.sync({force:true});
config.connect((err)=>{
    try{
        let createQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  
    // use the query to create a Database.
    config.query(createQuery, (err,res) => {
        if(err) {
            console.log(err);
        } 
        (async()=>{
             db.sequelize.sync({});
            console.log("sequelize authenticated")
        })();
    });
}
    catch(err){
        console.log(err);
    }
});

app;
module.export=app1;