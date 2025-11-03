const movieRoute = require("./movieRoutes");
const signinRoute = require("./signinRoutes");
const chiTietPhimRoute = require("./chiTietPhimRoutes");
const datveRoute = require("./datveRoutes");
const themLichChieu = require("./themLichChieuRoutes");
const xoaLichChieu = require("./xoaLichChieu");
const themPhim = require("./themPhimRoutes");
const xoaPhim = require("./xoaPhim");
const apiRoute = require("./apiRoutes");
const nhanVienRoute = require("./nhanVienRoutes");
const theRoutes = require("./theRoutes");
const doanhSoRoutes = require("./doanhSoRoutes");

// 👉 Định nghĩa middleware ngay trong file này
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    // Đã đăng nhập → cho phép đi tiếp
    return next();
  }

  // Nếu chưa đăng nhập → hiển thị thông báo và chuyển hướng
  res.send(`
    <script>
      alert("Vui lòng đăng nhập trước khi sử dụng chức năng này!");
      window.location.href = "/";
    </script>
  `);
}

function route(app) {
  app.use("/employee", isLoggedIn);
  app.use("/employee/themPhim", themPhim);
  app.use("/employee/xoaPhim", xoaPhim);
  app.use("/employee/api/showtimes", themLichChieu);
  app.use("/employee/xoaLichChieu", xoaLichChieu);
  app.use("/employee", nhanVienRoute);
  app.use("/api", apiRoute);
  app.use("/quanly", doanhSoRoutes);
  app.use("/customer", isLoggedIn);
  app.use("/customer/datve", datveRoute);
  app.use("/customer/chiTietPhim", chiTietPhimRoute);
  app.use("/customer/the", theRoutes);
  app.use("/customer", movieRoute);
  app.use("/", signinRoute);
}

module.exports = route;
