const path = require("path");
//const { connectDB } = require("../config/db");

class TheController {
  async giave(req, res) {
    res.render("giaVe");
  }
  async uudai(req, res) {
    res.render("uuDai");
  }
  async nhuongquyen(req, res) {
    res.render("nhuongQuyen");
  }
}

module.exports = new TheController();
