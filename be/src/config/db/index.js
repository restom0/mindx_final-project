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
// async function getNotes() {
//   const [rows] = await pool.query("SELECT * FROM users");
//   if (rows) {
//     console.log("Connect successfully");
//   }
// }
// const rows = getNotes();
module.exports = pool;
