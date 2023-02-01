var mysql = require('mysql2');
var express=require('express');
const routes = require('./routes/routes');
var app=express()
app.use(express.json())
require('dotenv').config();


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   // var sql = "ALTER TABLE users ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
//   // con.query(sql, function (err, result) {
//   //   if (err) throw err;
//   //   console.log("Database created");
//   });
// });

// app.post('/post',(req,res)=>
// {
//   const email=req.body.email;
//   const firstname=req.body.firstname;
//   const lastname=req.body.lastname;
//   const password=req.body.password;

//   con.query('insert into users values(null,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',[email,firstname,lastname,password],(err,result)=>
//   {
//     if(err)
//     {
//       console.log(err);
//     }
//     els
//     {
//       res.send("VALUES INSERTED into the table");
//     }
//   })
// })
routes(app);
app.listen(process.env.PORT,(err)=>
{
  if(err)
  {
    console.log(err)
  }
  else
  {
    console.log("on port 3000")
  }
});
app.get("/healthz",(req,res)=>{
  res.status(200).json();
})
module.exports=app;
