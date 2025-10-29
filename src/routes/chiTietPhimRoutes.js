const chiTietPhim = require("../controllers/ChiTietPhimController");
const express = require("express");
const router = express.Router();

router.get("/:slug", chiTietPhim.trang);

module.exports = router;
