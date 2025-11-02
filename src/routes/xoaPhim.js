const XoaPhimController = require("../controllers/XoaPhimController");

const express = require("express");
const router = express.Router();
// ... cấu hình khác


// Route hiển thị danh sách phim
router.get('/', XoaPhimController.danhSach);

// Route xử lý xóa phim
router.delete('/:id', XoaPhimController.xoaPhim);








module.exports = router;