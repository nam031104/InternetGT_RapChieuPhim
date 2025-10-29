const signinController = require("../controllers/SigninController");
const express = require("express");
const router = express.Router();

router.get("/", signinController.dangnhap);
router.post("/", signinController.Nhan);

module.exports = router;
