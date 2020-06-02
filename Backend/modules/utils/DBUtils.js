// --- libraries importing
require("dotenv").config();
const sql= require("mssql");



// --- configurations:

const config = {
  user: "amitAlon",
  password: "sry9Bzhx",
  server: "recipe-server-aa.database.windows.net",
  database: "recipe_db",
  connectionTimeout: 1500000,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};
  const pool = new sql.ConnectionPool(config);
  const poolConnect = pool
    .connect()
    .then(() => console.log("new connection pool Created"))
    .catch((err) => console.log(err));


exports.execQuery = async function(query){
    await poolConnect;
    try{
        let result= await pool.request().query(query);
        return result.recordset;
    }catch(error){
        console.error("SQL Error", error);
        throw error;
    }
};
