const XoaLichChieu = require("../controllers/XoaLichChieu");

const express = require("express");
const router = express.Router();
// ... cấu hình khác

// Route hiển thị danh sách phim
router.get("/", XoaLichChieu.danhSach);

// Route xử lý xóa phim
router.delete("/:id", XoaLichChieu.xoaLichchieu);

module.exports = router;
