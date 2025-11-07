require("dotenv").config();
// 1. RECOMMENDATION: Use the /promise driver for modern async/await
let mysql = require("mysql2/promise"); 

// 2. FIX: Create a Connection POOL, but assign it to the 'conn' variable name
let conn = mysql.createPool({ 
    // Using the CORRECTED deployment variables:
    host: process.env.MYSQLHOST, 
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    multipleStatements: true,
    
    // 3. NEW: Pool Configuration for stability
    connectionLimit: 10,       // Max connections in the pool
    waitForConnections: true,  
    queueLimit: 0              
});

// 4. REMOVE: We remove the manual conn.connect() block.
// The pool manages connections automatically when you use it.
/*
conn.connect((err)=> {
    if(err) {
        console.log("database is not connected"+err);
    } else {
        console.log("database is connected");
    }
});
*/

// 5. EXPORT: Export the pool object, which is named 'conn'
module.exports = conn;