const sql = require("mssql");

// Cấu hình kết nối SQL Server
const config = {
  user: "nam", // tài khoản SQL
  password: "123456", // mật khẩu
  server: "127.0.0.1", // hoặc tên máy chủ
  database: "RapChieuPhim", // tên CSDL của bạn
  port: 1433,
  options: {
    encrypt: false, // false nếu dùng localhost
    trustServerCertificate: true, // cần thiết cho SQL local
  },
};

// Hàm kết nối
async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Đã kết nối SQL Server!");
    return pool;
  } catch (err) {
    console.error("❌ Lỗi kết nối SQL:", err);
    throw err;
  }
}

module.exports = { sql, connectDB };
