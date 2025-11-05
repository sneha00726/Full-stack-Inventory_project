require("dotenv").config();
let mysql=require("mysql2");

let conn=mysql.createConnection({
     host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  multipleStatements: true
  //local database 
   /* host:process.env.db_host,
    user:process.env.db_username,
    password:process.env.db_password,
    database:process.env.db_name,
    multipleStatements: true  */
});

conn.connect((err)=>
{
    if(err)
    {
        console.log("database is not connected"+err);
    }
    else
    {
        console.log("database is connected");
    }
});

module.exports=conn;