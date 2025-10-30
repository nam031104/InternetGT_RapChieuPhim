const themPhim = require("../controllers/ThemPhimControllers");
const express = require("express");
const router = express.Router();

router.get("/", themPhim.hienthi);
router.post("/", themPhim.themPhim);

module.exports = router;
