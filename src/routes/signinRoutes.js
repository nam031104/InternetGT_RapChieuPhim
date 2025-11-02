const signinController = require("../controllers/SigninController");
const express = require("express");
const router = express.Router();

router.get("/dangxuat", signinController.dangxuat);
router.get("/", signinController.dangnhap);
router.post("/", signinController.Nhan);
// router.post("/register", signinController.dangky);
router.post("/register", signinController.dangky);
module.exports = router;
