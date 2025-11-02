const { sql, poolPromise } = require("../config/db");

class ThemPhimController {
  // Hiển thị form thêm phim
  hienthi(req, res) {
    res.render("themPhim", { layout: "nhanvien" });
  }

  // Xử lý thêm phim mới
  async themPhim(req, res) {
    const {
      tenphim,
      theloai,
      thoiluong,
      daodien,
      ngayKhoiChieu,
      mota,
      posterLink,
      trailerLink,
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!tenphim || !theloai || !thoiluong || !daodien || !ngayKhoiChieu) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error("Không thể kết nối đến SQL Server.");
      }

      // Kiểm tra phim đã tồn tại chưa (theo tên phim)
      const checkMovie = await pool
        .request()
        .input("tenphim", sql.NVarChar(100), tenphim)
        .query("SELECT id FROM tblMovie WHERE tenphim = @tenphim");

      if (checkMovie.recordset.length > 0) {
        // Phim đã tồn tại -> trả lỗi 409 Conflict
        return res
          .status(409)
          .json({ message: "Phim này đã tồn tại trong hệ thống." });
      }

      // Thêm phim mới
      await pool
        .request()
        .input("tenphim", sql.NVarChar(100), tenphim)
        .input("theloai", sql.NVarChar(50), theloai)
        .input("thoiluong", sql.Int, thoiluong) // Giả sử thoiluong kiểu int (phút)
        .input("daodien", sql.NVarChar(100), daodien)
        .input("ngayKhoiChieu", sql.Date, ngayKhoiChieu)
        .input("mota", sql.NVarChar(sql.MAX), mota || null)
        .input("posterLink", sql.NVarChar(sql.MAX), posterLink || null)
        .input("trailerLink", sql.NVarChar(sql.MAX), trailerLink || null)
        .query(
          `INSERT INTO tblMovie 
          (tenphim, theloai, thoiluong, daodien, ngayKhoiChieu, mota, posterLink, trailerLink)
          VALUES 
          (@tenphim, @theloai, @thoiluong, @daodien, @ngayKhoiChieu, @mota, @posterLink, @trailerLink)`
        );

      res.status(201).send(`
  <script>
    alert("✅ Thêm phim thành công!");
    window.history.back();
  </script>
`);
    } catch (err) {
      console.error("❌ Lỗi thêm phim:", err);
      res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
  }
}

module.exports = new ThemPhimController();
