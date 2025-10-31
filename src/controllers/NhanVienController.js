const path = require("path");
//const { connectDB } = require("../config/db");

class NhanVienController {
  async trangchu(req, res) {
    res.render("nhanvienhome", { layout: "nhanvien" });
  }
}

module.exports = new NhanVienController();
