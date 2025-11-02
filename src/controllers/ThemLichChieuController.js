const {
  getAllUsers,
  getMovieByTen,
  // addUser,
  // getUserById,
  // updateUser,
  // deleteUser,
} = require("../config/userService");
const { sql, poolPromise } = require("../config/db");

const formatTime = (t) => {
  if (!t) return null;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
  return null;
};

function toSQLTime(timeString) {
  if (!timeString) return null;
  const [h, m, s = "00"] = timeString.split(":");
  const d = new Date();
  d.setHours(parseInt(h), parseInt(m), parseInt(s), 0);
  return d;
}

class ThemLichChieuController {
  async themLichChieu(req, res) {
    const { tenphim, ngayChieu, gioBD, gioKT, gia, tblAuditoriumid } = req.body;
    const gioBDau = formatTime(gioBD);
    const gioKThuc = formatTime(gioKT);
    const gioBatDau = toSQLTime(gioBDau);
    const gioKetThuc = toSQLTime(gioKThuc);
    console.log(req.body);
    console.log(gioBatDau);
    console.log(gioKetThuc);
    // 🛑 Kiểm tra thiếu dữ liệu
    if (
      !tenphim ||
      !ngayChieu ||
      !gioBatDau ||
      !gioKetThuc ||
      !gia ||
      !tblAuditoriumid
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error("Không thể kết nối đến SQL Server.");
      }

      // 🔍 1. Tìm movie ID theo tên phim
      const movieQuery = await pool
        .request()
        .input("tenphim", sql.NVarChar(100), tenphim)
        .query("SELECT id FROM tblMovie WHERE tenphim = @tenphim");

      if (movieQuery.recordset.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy phim có tên này, hãy thêm phim trước",
        });
      }

      const movieId = movieQuery.recordset[0].id;

      // 🔍 2. Kiểm tra phòng chiếu tồn tại không
      const roomQuery = await pool
        .request()
        .input("id", sql.Int, tblAuditoriumid)
        .query("SELECT id FROM tblAuditorium WHERE id = @id");

      if (roomQuery.recordset.length === 0) {
        return res.status(404).json({ message: "Phòng chiếu không tồn tại." });
      }

      const conflictQuery = await pool
        .request()
        .input("tblAuditoriumid", sql.Int, tblAuditoriumid)
        .input("gioBatDau", sql.Time, gioBatDau)
        .input("gioKetThuc", sql.Time, gioKetThuc)
        .input("ngayChieu", sql.Date, ngayChieu).query(`
          SELECT * FROM tblShowtime
          WHERE tblAuditoriumid = @tblAuditoriumid
            AND ngayChieu = @ngayChieu
            AND gioBatDau < @gioKetThuc
            AND gioKetThuc > @gioBatDau
        `);

      if (conflictQuery.recordset.length > 0) {
        return res.status(409).json({
          message:
            "Xung đột lịch chiếu: phòng này đã có phim chiếu vào khoảng thời gian bạn chọn.",
        });
      }

      // ✅ 3. Thêm lịch chiếu mới
      await pool
        .request()
        .input("ngayChieu", sql.Date, ngayChieu)
        .input("gioBatDau", sql.Time, gioBatDau)
        .input("gioKetThuc", sql.Time, gioKetThuc)
        .input("gia", sql.Decimal(10, 2), gia)
        .input("tblAuditoriumid", sql.Int, tblAuditoriumid)
        .input("tblMovieid", sql.Int, movieId).query(`
        INSERT INTO tblShowtime 
        (ngayChieu, gioBatDau, gioKetThuc, gia, tblAuditoriumid, tblMovieid)
        VALUES (@ngayChieu, @gioBatDau, @gioKetThuc, @gia, @tblAuditoriumid, @tblMovieid)
      `);

      res.status(201).send(`
  <script>
    alert("✅ Thêm phim thành công!");
    window.history.back();
  </script>
`);
    } catch (err) {
      console.error("❌ Lỗi thêm lịch chiếu:", err);
      res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
    }
  }

  hienthi(req, res) {
    res.render("themLichChieu", { layout: "nhanvien" });
  }
}
module.exports = new ThemLichChieuController();
