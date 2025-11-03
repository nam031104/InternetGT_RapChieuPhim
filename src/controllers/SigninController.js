const path = require("path");
const { sql, poolPromise } = require("../config/db");

class SigninController {
  // -------------------------------------------
  // GET /signin
  // -------------------------------------------
  dangnhap(req, res) {
    console.log("📄 Truy cập trang đăng nhập");
    console.log("👤 Session hiện tại:", req.session.user);
    const { error, success } = req.query;
    // Nếu đã đăng nhập rồi thì redirect
    if (req.session.user) {
      if (req.session.user.vaitro === "customer") {
        return res.redirect("/customer");
      } else if (req.session.user.vaitro === "staff") {
        return res.redirect("/employee");
      } else if (req.session.user.vaitro === "quanly") {
        return res.redirect("/quanly");
      }
    }

    res.render("signin", { error, success });
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
        } else if (user.vaitro === "quanly") {
          return res.redirect("/quanly");
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

  async dangky(req, res) {
    const {
      name,
      email,
      password,
      confirmPassword,
      day,
      month,
      year,
      gender,
      phone,
      terms,
    } = req.body;

    try {
      // 1️⃣ Kiểm tra các trường bắt buộc
      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword ||
        !phone ||
        !day ||
        !month ||
        !year ||
        !gender ||
        !terms
      ) {
        return res.redirect(
          `/?error=${encodeURIComponent(
            "Vui lòng nhập đầy đủ thông tin bắt buộc."
          )}`
        );
      }

      if (password !== confirmPassword) {
        return res.redirect(
          `/?error=${encodeURIComponent(
            "Mật khẩu và xác nhận mật khẩu không khớp."
          )}`
        );
      }

      const pool = await poolPromise;
      if (!pool) {
        console.error("❌ Kết nối SQL thất bại!");
        return res.redirect(
          `/?error=${encodeURIComponent(
            "Không thể kết nối đến cơ sở dữ liệu."
          )}`
        );
      }

      // 2️⃣ Kiểm tra Email đã tồn tại
      const checkEmail = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT email FROM tblUser WHERE email = @email");

      if (checkEmail.recordset.length > 0) {
        return res.redirect(
          `/?error=${encodeURIComponent(
            "Email đã được đăng ký, vui lòng chọn email khác."
          )}`
        );
      }

      // 3️⃣ Chuẩn bị dữ liệu
      const dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      const defaultRole = "customer";

      // 4️⃣ Lưu dữ liệu vào Database
      await pool
        .request()
        .input("name", sql.NVarChar, name)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, password)
        .input("dateOfBirth", sql.Date, dateOfBirth)
        .input("gender", sql.VarChar, gender)
        .input("phone", sql.VarChar, phone)
        .input("vaitro", sql.VarChar, defaultRole)
        .query(
          "INSERT INTO tblUser (ten, username, password, ngaysinh, dienthoai, vaitro) VALUES (@name, @email, @password, @dateOfBirth, @phone, @vaitro)"
        );

      // 5️⃣ Đăng ký thành công
      return res.redirect(
        `/?success=${encodeURIComponent("Đăng ký thành công!")}`
      );
    } catch (err) {
      console.error("❌ Lỗi khi đăng ký:", err);
      return res.redirect(
        `/?error=${encodeURIComponent(
          "Có lỗi xảy ra trong quá trình đăng ký, vui lòng thử lại."
        )}`
      );
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
