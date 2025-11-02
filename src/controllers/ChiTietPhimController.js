const path = require("path");
const { connectDB } = require("../config/db");
const {
  getAllUsers,
  getMovieByTen,
  // addUser,
  // getUserById,
  // updateUser,
  // deleteUser,
} = require("../config/userService");

class ChiTietPhimController {
  async chiTietPhim(req, res) {
    try {
      // console.log("getMovieByTen =", getMovieByTen);
      const tenPhim = decodeURIComponent(req.params.slug);

      const phim = await getMovieByTen(tenPhim);

      const fullUrl = phim.trailerLink;
      // 1. Tạo đối tượng URL để phân tích
      const urlObject = new URL(fullUrl);
      // 2. Sử dụng .searchParams để tìm giá trị của tham số 'v'
      const videoId = urlObject.searchParams.get("v");
      // Kết quả: "DNtbMv46b2w"
      // 3. Tạo URL nhúng (Embed URL)
      const videoTrailerEmbed = `https://www.youtube.com/embed/${videoId}`;

      res.render("chiTietPhim", {
        id: phim.id,
        tenphim: phim.tenphim,
        posterLink: phim.posterLink,
        theloai: phim.theloai,
        daodien: phim.daodien,
        thoiluong: phim.thoiluong,
        ngayKhoiChieu: phim.ngayKhoiChieu.toLocaleDateString("vi-VN"),
        moTa: phim.mota,
        videoTrailerEmbed: videoTrailerEmbed,
      });

      if (!phim) {
        return res
          .status(404)
          .render("404", { message: "Không tìm thấy phim" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).render("500", { message: "Lỗi server!" });
    }
  }

  async hienthi(req, res) {
    try {
      const users = await getAllUsers();
      console.log("Dữ liệu Users trong Controller:", users); // Thêm dòng này
      res.render("home", { users: users }); // Đảm bảo tên biến là 'users'
    } catch (error) {
      console.error("❌ Lỗi khi lấy users:", error);
      res.status(500).send("Lỗi server");
    }
  }
}
module.exports = new ChiTietPhimController();
