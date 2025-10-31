const path = require("path");
const { sql, poolPromise } = require("../config/db");

class SigninController {
  // -------------------------------------------
  // GET /signin
  // -------------------------------------------
  dangnhap(req, res) {
    console.log("📄 Truy cập trang đăng nhập");
    console.log("👤 Session hiện tại:", req.session.user);

    // Nếu đã đăng nhập rồi thì redirect
    if (req.session.user) {
      if (req.session.user.vaitro === "customer") {
        return res.redirect("/customer");
      } else if (req.session.user.vaitro === "staff") {
        return res.redirect("/employee");
      }
    }

    res.render("signin");
  }

  // -------------------------------------------
  // POST /signin
  // -------------------------------------------
  async Nhan(req, res) {
    const { username, password } = req.body;

    console.log("🔐 Đang xử lý đăng nhập...");
    console.log("📝 Username:", username);
    console.log("📝 Password:", password ? "***" : "empty");

    try {
      // 1️⃣ Validate
      if (!username || !password) {
        return res.render("signin", {
          error: "Vui lòng nhập đầy đủ thông tin đăng nhập.",
        });
      }

      // 2️⃣ Kết nối DB
      const pool = await poolPromise;
      if (!pool) {
        console.error("❌ Kết nối SQL thất bại!");
        return res.render("signin", {
          error: "Không thể kết nối đến cơ sở dữ liệu.",
        });
      }

      // 3️⃣ Query user
      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .query(
          "SELECT * FROM tblUser WHERE username = @username AND password = @password"
        );

      console.log("📊 Kết quả query:", result.recordset.length, "user");

      // 4️⃣ Kiểm tra
      if (result.recordset.length === 0) {
        return res.render("signin", {
          error: "Sai tên đăng nhập hoặc mật khẩu.",
        });
      }

      const user = result.recordset[0];
      console.log("👤 User tìm thấy:", user);

      // 5️⃣ Lưu session
      req.session.user = {
        id: user.id,
        ten: user.ten,
        username: user.username,
        vaitro: user.vaitro,
      };

      console.log("💾 Đã lưu vào session:", req.session.user);

      // 6️⃣ Save session và redirect
      req.session.save((err) => {
        if (err) {
          console.error("❌ Lỗi khi save session:", err);
          return res.render("signin", {
            error: "Có lỗi xảy ra, vui lòng thử lại.",
          });
        }

        console.log("✅ Session đã được save thành công!");
        console.log("🔄 Redirect theo vai trò:", user.vaitro);

        // Redirect theo vai trò
        if (user.vaitro === "customer") {
          return res.redirect("/customer");
        } else if (user.vaitro === "staff") {
          return res.redirect("/employee");
        } else {
          return res.render("signin", {
            error: "Tài khoản không có vai trò hợp lệ.",
          });
        }
      });
    } catch (err) {
      console.error("❌ Lỗi khi đăng nhập:", err);
      return res.render("signin", {
        error: "Có lỗi xảy ra, vui lòng thử lại sau.",
      });
    }
  }

  // -------------------------------------------
  // GET /dangxuat
  // -------------------------------------------
  dangxuat(req, res) {
    console.log("👋 User đăng xuất:", req.session.user);

    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Lỗi khi đăng xuất:", err);
      }

      console.log("✅ Đã xóa session");
      res.redirect("/");
    });
  }
}

module.exports = new SigninController();
