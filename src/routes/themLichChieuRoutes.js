const themLichChieu = require("../controllers/ThemLichChieuController");
const express = require("express");
const router = express.Router();

router.get("/", themLichChieu.hienthi);
router.post("/", themLichChieu.themLichChieu);

module.exports = router;
