// controllers/phimController.js

const { sql, poolPromise } = require("../config/db"); // Sử dụng cấu hình kết nối của bạn

function formatDate(date) {
  const d = new Date(date);
  const weekday = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return `${weekday} (${day}/${month})`;
}

function formatTime(time) {
  if (!time) return "";
  if (typeof time === "string") return time.substring(0, 5);
  if (time instanceof Date) {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
  return "";
}

class XoaLichChieu {
  /**
   * Hiển thị danh sách phim từ SQL Server
   * Route: GET /movies (Giả định)
   */
  async danhSach(req, res) {
    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error("Không thể kết nối đến SQL Server.");
      }

      // Lấy tất cả các cột cần thiết từ tblMovie
      const result = await pool.request().query(`SELECT 
                        LC.id, 
                        LC.ngayChieu, 
                        LC.gioBatdau, 
                        LC.gioKetthuc, 
                        LC.gia, 
                        LC.tblAuditoriumid, 
                        LC.tblMovieid,
                        M.tenphim, -- ⭐️ Lấy tên phim từ bảng Movie
                        A.sophong  -- ⭐️ (Tùy chọn) Lấy tên phòng chiếu
                    FROM tblShowtime LC 
                    LEFT JOIN tblMovie M ON LC.tblMovieid = M.id
                    LEFT JOIN tblAuditorium A ON LC.tblAuditoriumid = A.id -- Giả định bạn muốn hiển thị tên phòng
                    ORDER BY LC.id DESC`);

      // Sắp xếp theo ID mới nhất

      // Render view 'movies.hbs' và truyền dữ liệu phim

      const lichchieu = result.recordset.map((st) => ({
        id: st.id,
        tenphim: st.tenphim,
        ngayChieu: formatDate(st.ngayChieu),
        gioBatdau: formatTime(st.gioBatdau),
        gioKetthuc: formatTime(st.gioKetthuc),
        gia: st.gia,
        tblAuditoriumid: st.tblAuditoriumid,
      }));

      res.render("xoaLichChieu", {
        lichchieu: lichchieu,
        pageTitle: "Quản Lý Lịch Chiếu",
        layout: "nhanvien",
      });
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách lịch chiếu:", err);
      res.status(500).send("Lỗi máy chủ khi tải danh sách lịch chiếu.");
    }
  }

  /**
   * Xử lý yêu cầu xóa phim theo ID
   * Route: DELETE /movies/:id (Giả định)
   */
  async xoaLichchieu(req, res) {
    // Lấy ID phim từ URL params
    const ShowtimeID = req.params.id;

    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error("Không thể kết nối đến SQL Server.");
      }

      // Thực thi lệnh DELETE
      const result = await pool
        .request()
        .input("ShowtimeID", sql.Int, ShowtimeID) // Khai báo tham số ID
        .query("DELETE FROM tblShowtime WHERE id = @ShowtimeID");

      // Kiểm tra số hàng bị ảnh hưởng để xác nhận xóa
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          success: false,
          message: "Lịch chiếu không tồn tại hoặc đã bị xóa.",
        });
      }

      // Phản hồi thành công
      res.status(200).json({
        success: true,
        message: `✅ Xóa lịch chiếu ID: ${ShowtimeID} thành công.`,
        ShowtimeID: ShowtimeID,
      });
    } catch (err) {
      console.error(`❌ Lỗi xóa phim ID ${ShowtimeID}:`, err);
      // Xử lý các lỗi liên quan đến ràng buộc khóa ngoại (foreign key)
      if (err.message.includes("REFERENCE constraint")) {
        return res.status(400).json({
          success: false,
          message:
            "Không thể xóa lịch chiếu này này do đang có dữ liệu liên quan (ví dụ: Lịch chiếu).",
        });
      }
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi xóa lịch chiếu .",
        error: err.message,
      });
    }
  }
}

module.exports = new XoaLichChieu();
