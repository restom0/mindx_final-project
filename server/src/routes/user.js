const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
router.get("/login", UserController.auth);
router.post("/register", UserController.addAccount);
router.post("/delete", UserController.removeAccount);
module.exports = router;
