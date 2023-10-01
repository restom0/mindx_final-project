const User = require("../models/User");

class UserController {
  // [GET] /login
  async auth(req, res) {
    try {
      const { username, userpassword } = req.query;

      if (
        !username ||
        username === "" ||
        !userpassword ||
        userpassword === ""
      ) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const queryResult = await User.getUser(username, userpassword);

      if (queryResult) {
        return res.json({
          apitoken: queryResult.apitoken,
          idRole: queryResult.idRole,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  async addAccount(req, res) {}
  async removeAccount(req, res) {}
}

module.exports = new UserController();
