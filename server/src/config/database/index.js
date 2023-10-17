const mysql = require("mysql2");
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "mindx_cijs",
  })
  .promise();
if (pool) {
  console.log("Connect successfully");
}
module.exports = pool;
