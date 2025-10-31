const nhanVienController = require("../controllers/NhanVienController");
const express = require("express");
const router = express.Router();

router.get("/", nhanVienController.trangchu);

module.exports = router;
