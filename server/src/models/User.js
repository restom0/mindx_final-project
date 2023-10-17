const pool = require("../config/database");
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
class User {
  async getUser(username, password) {
    const query = "SELECT * FROM users WHERE username = ? AND userpassword = ?";
    const [rows] = await pool.query(query, [username, password]);
    return rows[0];
  }
  async addUser(username, password) {
    const apiToken = generateRandomString(10);
    const query1 = "SELECT * FROM users WHERE username = ?";
    const [rows1] = await pool.query(query1, [username]);
    if (rows1.length == 0) {
      const query =
        "INSERT INTO users (username, userpassword, apitoken, idRole) VALUES (?, ?, ?, 1)";
      const [res] = await pool.query(query, [username, password, apiToken]);
      return res;
    }
  }
  async removeTask(apitoken) {
    const query = "DELETE FROM users WHERE apitoken = ?";
    const [rows] = await pool.query(query, [apitoken]);
    return rows;
  }
}

module.exports = new User();
