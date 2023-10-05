const { token } = require("morgan");
const Task = require("../models/Task");

class TaskController {
  // [GET] /login
  async getTasks(req, res) {
    try {
      const { apitoken } = req.query;

      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "Apitoken is required" });
      }
      const queryResult = await Task.getTasks(apitoken);
      var result = [];
      queryResult.forEach((el) => {
        var task = new Object();
        task.id = el.id;
        task.name = el.taskname;
        task.type = el.tasktype;
        task.estPomodoro = el.estPomodoro;
        task.isCompleted = el.isCompleted;
        result.push(task);
      });
      if (queryResult) {
        return res.json({
          check: true,
          result: result,
        });
      } else {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  async addTask(req, res) {
    try {
      const { taskname, tasktype, estPomodoro, apitoken } = req.query;
      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "apitoken is required" });
      }
      if (!taskname || taskname == "") {
        return res.status(400).json({ error: "taskname is required" });
      }
      if (!tasktype || tasktype == "") {
        return res.status(400).json({ error: "tasktype is required" });
      }
      if (!estPomodoro || estPomodoro == "") {
        return res.status(400).json({ error: "estPomodoro is required" });
      }
      const queryResult = await Task.addTask(
        taskname,
        tasktype,
        estPomodoro,
        apitoken
      );
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
  async editTask(req, res) {
    try {
      const { id, apitoken, taskname, tasktype } = req.query;
      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "apitoken is required" });
      }
      if (!id || id == "") {
        return res.status(400).json({ error: "id is required" });
      }
      if ((taskname && taskname !== "") || (tasktype && tasktype !== "")) {
        const queryResult = await Task.editTask(id, taskname, tasktype);
        if (queryResult) {
          return res.json({
            check: true,
          });
        } else {
          return res.status(400).json({ error: "Invalid credentials" });
        }
      } else {
        return res.status(400).json({ error: "Dữ liệu không đổi" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  async removeTask(req, res) {
    try {
      const { id, apitoken } = req.query;
      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "apitoken is required" });
      }
      if (!id || id == "") {
        return res.status(400).json({ error: "id is required" });
      }
      const queryResult = await Task.removeTask(id);
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
  async statusTask(req, res) {
    try {
      const { id, apitoken } = req.query;
      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "apitoken is required" });
      }
      if (!id || id == "") {
        return res.status(400).json({ error: "id is required" });
      }
      const queryResult = await Task.statusTask(id);
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
  async statDailyTask(req, res) {
    try {
      const { apitoken } = req.query;
      if (!apitoken || apitoken == "") {
        return res.status(400).json({ error: "apitoken is required" });
      }
      const queryResult = await Task.statDailyTask(apitoken);
      var result = [];
      console.log(queryResult);
      queryResult.forEach((el) => {
        var task = new Object();
        task.estPomodoro = el.estPomodoro;
        task.finishAtDay = new Date(el.finishAt).getDay();
        task.finishAtMonth = new Date(el.finishAt).getMonth();
        task.finishAtYear = new Date(el.finishAt).getFullYear();
        result.push(task);
      });
      if (queryResult) {
        return res.json({
          check: true,
          result: result,
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

module.exports = new TaskController();
