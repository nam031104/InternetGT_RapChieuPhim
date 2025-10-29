const path = require("path");
const { connectDB } = require("../config/db");

class chiTietPhimController {
  trang(req, res) {
    res.sendFile(path.join(__dirname, "..", "public", "ChiTietPhim.html"));
  }

  async hienthi(req, res) {
    try {
      const pool = await connectDB(); // phải await vì connect async
      const result = await pool.request().query("SELECT * FROM Phim"); // await query
      res.json(result.recordset); // recordset chứa mảng dữ liệu
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
}

module.exports = new chiTietPhimController();
