const express = require("express");
const router = express.Router();

const TaskController = require("../controllers/TaskController");
router.get("/", TaskController.getTasks);
router.post("/add", TaskController.addTask);
router.post("/edit", TaskController.editTask);
router.post("/delete", TaskController.removeTask);
router.post("/status", TaskController.statusTask);
router.get("/stat", TaskController.statDailyTask);
router.post("/deleteall", TaskController.removeAllTask);
module.exports = router;
