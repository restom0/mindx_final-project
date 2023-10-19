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
      console.log(queryResult);
      if (queryResult) {
        return res.json({
          check: true,
          apitoken: queryResult.apitoken,
          idRole: queryResult.idRole,
        });
      } else {
        return res.status(400).json({ error: "Tài khoản không tồn tại" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  async addAccount(req, res) {
    try {
      const { username, userpassword } = req.query;
      if (!username || username == "") {
        return res.status(400).json({ error: "username is required" });
      }
      if (!userpassword || userpassword == "") {
        return res.status(400).json({ error: "userpassword is required" });
      }
      const queryResult = await User.addUser(username, userpassword);
      if (queryResult) {
        return res.json({
          check: true,
        });
      } else {
        return res.status(400).json({ error: "Tài khoản đã tồn tại" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  async removeAccount(req, res) {
    try {
      const { apitoken } = req.query;
      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "apitoken is required" });
      }
      const queryResult = await User.removeTask(apitoken);
      if (queryResult) {
        return res.json({
          check: true,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
}

module.exports = new UserController();
