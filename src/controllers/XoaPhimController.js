// controllers/phimController.js

const { sql, poolPromise } = require("../config/db"); // Sử dụng cấu hình kết nối của bạn

class XoaPhimController {
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
                    id, tenphim, theloai, thoiluong, daodien, ngayKhoiChieu, mota
                    FROM tblMovie ORDER BY id DESC`); // Sắp xếp theo ID mới nhất

      // Render view 'movies.hbs' và truyền dữ liệu phim
      res.render("xoaPhim", {
        movies: result.recordset.map((movie) => ({
          ...movie,
          // ✅ Định dạng ngày khởi chiếu sang dạng dễ đọc (dd/mm/yyyy)
          ngayKhoiChieu: movie.ngayKhoiChieu
            ? new Date(movie.ngayKhoiChieu).toLocaleDateString("vi-VN")
            : "",
        })),
        pageTitle: "Danh Sách Phim",
        layout: "nhanvien",
      });
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách phim:", err);
      res.status(500).send("Lỗi máy chủ khi tải danh sách phim.");
    }
  }

  /**
   * Xử lý yêu cầu xóa phim theo ID
   * Route: DELETE /movies/:id (Giả định)
   */
  async xoaPhim(req, res) {
    // Lấy ID phim từ URL params
    const movieId = req.params.id;

    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error("Không thể kết nối đến SQL Server.");
      }

      // Thực thi lệnh DELETE
      const result = await pool
        .request()
        .input("MovieID", sql.Int, movieId) // Khai báo tham số ID
        .query("DELETE FROM tblMovie WHERE id = @MovieID");

      // Kiểm tra số hàng bị ảnh hưởng để xác nhận xóa
      if (result.rowsAffected[0] === 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Phim không tồn tại hoặc đã bị xóa.",
          });
      }

      // Phản hồi thành công
      res
        .status(200)
        .json({
          success: true,
          message: `✅ Xóa phim ID: ${movieId} thành công.`,
          movieId: movieId,
        });
    } catch (err) {
      console.error(`❌ Lỗi xóa phim ID ${movieId}:`, err);
      // Xử lý các lỗi liên quan đến ràng buộc khóa ngoại (foreign key)
      if (err.message.includes("REFERENCE constraint")) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Không thể xóa phim này do đang có dữ liệu liên quan (ví dụ: Lịch chiếu).",
          });
      }
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi máy chủ khi xóa phim.",
          error: err.message,
        });
    }
  }
}

module.exports = new XoaPhimController();
