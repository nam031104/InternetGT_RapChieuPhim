const path = require("path");
const { sql, poolPromise } = require("../config/db");

class signinController {
  dangnhap(req, res) {
    res.render("signin");
  }

  // Xử lý đăng nhập
  async Nhan(req, res) {
    console.log("hello");
    const { username, password } = req.body;
    console.log(`${req.body}`);
    console.log(`${username} va ${password}`);
    try {
      // 1️⃣ Kiểm tra input
      if (!username || !password) {
        return res.render("signin", {
          error: "Vui lòng nhập đầy đủ thông tin đăng nhập.",
        });
      }

      // 2️⃣ Lấy pool kết nối từ config
      const pool = await poolPromise;
      if (!pool) {
        console.error("❌ Kết nối SQL thất bại!");
        return res.render("signin", {
          error: "Không thể kết nối đến cơ sở dữ liệu.",
        });
      }

      // 3️⃣ Truy vấn tài khoản
      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(
          "SELECT * FROM tblUser WHERE username = @username AND password = @password"
        );

      // 4️⃣ Kiểm tra kết quả
      if (result.recordset.length === 0) {
        return res.render("signin", {
          error: "Sai tên đăng nhập hoặc mật khẩu.",
        });
      }

      // 5️⃣ Lưu thông tin vào session
      const user = result.recordset[0];
      req.session.user = {
        id: user.id,
        ten: user.ten,
        username: user.username,
        vaitro: user.vaitro,
      };

      console.log("✅ Đăng nhập thành công:", req.session.user);

      // 6️⃣ Điều hướng theo vai trò
      if (user.vaitro === "customer") {
        return res.redirect("/customer/home");
      } else if (user.vaitro === "staff") {
        return res.redirect("/employee");
      } else {
        return res.render("signin", {
          error: "Tài khoản không có vai trò hợp lệ.",
        });
      }
    } catch (err) {
      console.error("❌ Lỗi khi đăng nhập:", err);
      return res.render("signin", {
        error: "Có lỗi xảy ra, vui lòng thử lại sau.",
      });
    }
  }

  // Đăng xuất
  dangxuat(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Lỗi khi đăng xuất:", err);
      }
      res.redirect("/signin");
    });
  }
}

module.exports = new signinController();
