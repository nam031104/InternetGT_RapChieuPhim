const path = require("path");
// Sửa: Import poolPromise từ file db.js
const { sql, poolPromise } = require("../config/db");

// Giữ nguyên các truy vấn SQL (Đã chính xác)
const getTotalSalesQuery = `
    SELECT 
        SUM(gia) AS TotalSales 
    FROM 
        tblTicket;
`;

const getSalesByMovieQuery = `
    SELECT 
        M.tenphim, 
        SUM(T.gia) AS SalesAmount
    FROM 
        tblTicket AS T
    JOIN 
        tblShowtime AS S ON T.tblShowtimeid = S.id
    JOIN 
        tblMovie AS M ON S.tblMovieid = M.id
    GROUP BY 
        M.tenphim
    ORDER BY 
        SalesAmount DESC;
`;

const getSalesByMonthQuery = `
    SELECT 
        YEAR(S.ngayChieu) AS Year,
        MONTH(S.ngayChieu) AS Month,
        SUM(T.gia) AS SalesAmount
    FROM 
        tblTicket AS T
    JOIN 
        tblShowtime AS S ON T.tblShowtimeid = S.id
    WHERE 
        S.ngayChieu >= DATEADD(MONTH, -3, GETDATE()) -- Lọc 3 tháng gần nhất
    GROUP BY 
        YEAR(S.ngayChieu), MONTH(S.ngayChieu)
    ORDER BY 
        Year, Month;
`;

class DoanhSoController {
  async trangchu(req, res) {
    // 1. KHAI BÁO BIẾN Ở PHẠM VI RỘNG (Ngoài khối try)
    let totalSales = 0;
    let movieLabels = "[]";
    let movieSales = "[]";
    let monthLabels = "[]";
    let monthSales = "[]";

    try {
      const pool = await poolPromise;
      if (!pool) {
        // Nếu lỗi pool, thoát ngay lập tức
        return res.status(500).send("Lỗi Server: Không thể kết nối Database!");
      }
      const request = pool.request();

      // --- 2. LẤY DỮ LIỆU TỪ SQL ---

      // 1. Tổng doanh số
      const totalSalesResult = await request.query(getTotalSalesQuery);
      // Gán giá trị vào biến đã khai báo bên ngoài
      totalSales = totalSalesResult.recordset[0].TotalSales || 0;

      // 2. Doanh số theo phim
      const salesByMovieResult = await request.query(getSalesByMovieQuery);
      const salesByMovieData = salesByMovieResult.recordset || [];

      // 3. Doanh số 3 tháng gần nhất
      const salesByMonthResult = await request.query(getSalesByMonthQuery);
      const salesByMonthData = salesByMonthResult.recordset || [];

      // --- 3. CHUẨN BỊ DỮ LIỆU JSON ---

      const movieLabelsArr = salesByMovieData.map((d) => d.tenphim);
      const movieSalesArr = salesByMovieData.map((d) => d.SalesAmount);

      const monthLabelsArr = salesByMonthData.map(
        (d) => `${d.Month}/${d.Year}`
      );
      const monthSalesArr = salesByMonthData.map((d) => d.SalesAmount);

      // Gán chuỗi JSON vào biến đã khai báo bên ngoài
      movieLabels = JSON.stringify(movieLabelsArr);
      movieSales = JSON.stringify(movieSalesArr);
      monthLabels = JSON.stringify(monthLabelsArr);
      monthSales = JSON.stringify(monthSalesArr);
    } catch (err) {
      console.error("SQL Error (trangchu):", err.message);
      // Vẫn tiếp tục render để hiển thị lỗi kết nối/SQL
      // Dữ liệu sẽ là giá trị mặc định (totalSales=0, các mảng JSON rỗng '[]')
      // Thêm một biến cờ (flag) để báo lỗi cho frontend
      res.locals.error = "Đã xảy ra lỗi khi tải dữ liệu từ Database.";
    }

    // --- 4. RENDER VỚI DỮ LIỆU ĐÃ ĐƯỢC ĐẢM BẢO ---
    // Phần render này nằm ngoài khối try/catch, đảm bảo luôn được thực thi
    res.render("doanhSo", {
      // Sử dụng các biến đã được khai báo ở phạm vi rộng
      layout: "quanLy",
      totalSales: totalSales.toLocaleString("vi-VN"),
      movieLabels: movieLabels,
      movieSales: movieSales,
      monthLabels: monthLabels,
      monthSales: monthSales,
      // Truyền biến lỗi (nếu có)
      errorMessage: res.locals.error,
    });
  }
}

module.exports = new DoanhSoController();
