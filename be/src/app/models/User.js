const pool = require("../../config/db");

class User {
  async getUser(username, password) {
    const query = "SELECT * FROM users WHERE username = ? AND userpassword = ?";
    const [rows] = await pool.query(query, [username, password]);
    return rows[0];
  }
}

module.exports = new User();
