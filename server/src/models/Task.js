const pool = require("../config/database");

class Task {
  async getTasks(token) {
    const query =
      "SELECT task.id,taskname,tasktype,estPomodoro,isCompleted FROM task INNER JOIN users ON task.userId = users.id WHERE users.apitoken = ?";
    const [rows] = await pool.query(query, [token]);
    return rows;
  }
  async addTask(taskname, tasktype, estPomodoro, token) {
    const query = "SELECT * FROM users WHERE apitoken = ?";
    const [rows] = await pool.query(query, [token]);

    const query2 =
      "INSERT INTO task (taskname, tasktype, estPomodoro, isCompleted, userId) VALUES (?, ?, ?, 0, ?)";
    const [res] = await pool.query(query2, [
      taskname,
      tasktype,
      estPomodoro,
      rows[0].id,
    ]);
    return res;
  }
  async editTask(id, taskname, tasktype) {
    if (!taskname || taskname == "") {
      const query = "UPDATE task SET tasktype=? WHERE id = ?";
      const [rows] = await pool.query(query, [tasktype, id]);
      return rows;
    }
    if (!tasktype || tasktype == "") {
      const query = "UPDATE task SET taskname = ? WHERE id = ?";
      const [rows] = await pool.query(query, [taskname, id]);
      return rows;
    } else {
      const query = "UPDATE task SET taskname = ?, tasktype=? WHERE id = ?";
      const [rows] = await pool.query(query, [taskname, tasktype, id]);
      return rows;
    }
  }
  async removeTask(id) {
    const query = "DELETE FROM task WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    return rows;
  }
  async statusTask(id) {
    const query = "SELECT * FROM task WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    const query1 = "UPDATE task SET isCompleted=?,finishAT=NOW() WHERE id = ?";
    const [rows1] = await pool.query(query1, [!rows[0].isCompleted, id]);
    return rows1;
  }
  async statDailyTask(token) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const query = `
    SELECT estPomodoro, finishAt FROM task 
    INNER JOIN users ON task.userId = users.id
    WHERE users.apitoken = ? 
      AND finishAt IS NOT NULL
      AND finishAt >= ?
      ORDER BY finishAt ASC
  `;
    const [rows] = await pool.query(query, [token, sevenDaysAgo]);
    return rows;
  }
}

module.exports = new Task();
