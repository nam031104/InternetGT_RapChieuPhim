const sql = require("mssql");

// Cấu hình kết nối SQL Server
const config = {
  user: "nam", // tài khoản SQL
  password: "123456", // mật khẩu
  server: "127.0.0.1", // hoặc tên máy chủ
  database: "CinemaDB", // tên CSDL của bạn
  port: 1433,
  options: {
    encrypt: false, // false nếu dùng localhost
    trustServerCertificate: true, // cần thiết cho SQL local
  },
};

// Hàm kết nối
// Tạo một Promise cho Pool kết nối
// Nó sẽ kết nối một lần duy nhất khi ứng dụng khởi động.
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("✅ Đã kết nối SQL Server!");
    return pool;
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối SQL:", err);
    // Có thể throw err; ở đây nếu muốn ứng dụng dừng lại khi kết nối lỗi
    return null; // Trả về null hoặc một đối tượng lỗi để xử lý sau
  });

// Export cả sql và poolPromise
module.exports = {
  sql,
  poolPromise,
};
