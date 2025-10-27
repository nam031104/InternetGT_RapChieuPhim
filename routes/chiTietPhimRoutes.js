const chiTietPhim = require("../controllers/chiTietPhimController");
const express = require("express");
const router = express.Router();

router.get("/:slug", chiTietPhim.trang);

module.exports = router;
