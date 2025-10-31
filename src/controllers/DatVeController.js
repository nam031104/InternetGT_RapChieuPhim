const { sql, poolPromise } = require("../config/db");

// Helper: định dạng ngày (ví dụ: T2 (30/10))
function formatDate(date) {
  const d = new Date(date);
  const weekday = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return `${weekday} (${day}/${month})`;
}

// Helper: định dạng giờ HH:MM từ Date hoặc string
function formatTime(time) {
  if (!time) return "";
  if (typeof time === "string") return time.substring(0, 5);
  if (time instanceof Date) {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
  return "";
}

class DatVeController {
  // -------------------------------------------
  // GET /dat-ve/:movieId
  // -------------------------------------------
  async Datve(req, res) {
    const movieId = parseInt(req.params.movieId, 10);

    if (!movieId || isNaN(movieId)) {
      return res.status(400).send("Thiếu hoặc sai ID phim.");
    }

    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).send("Lỗi kết nối CSDL.");
    }

    try {
      const request = pool.request();
      const query = `
        SELECT 
          st.id, 
          st.ngayChieu, 
          st.gioBatdau, 
          st.gia, 
          st.tblAuditoriumid, 
          st.tblMovieid, 
          a.sophong, 
          m.tenPhim
        FROM tblShowtime st
        LEFT JOIN tblAuditorium a ON st.tblAuditoriumid = a.id
        LEFT JOIN tblMovie m ON st.tblMovieid = m.id
        WHERE st.tblMovieid = @movieId
        ORDER BY st.ngayChieu, st.gioBatdau
      `;

      const result = await request
        .input("movieId", sql.Int, movieId)
        .query(query);

      const showtimes = result.recordset;

      // Nếu không có suất chiếu
      if (!showtimes || showtimes.length === 0) {
        return res.render("datve", {
          movie: { tenPhim: "Phim không tìm thấy", giaVe: 0 },
          showtimesByDate: [],
          showtimesGrouped: {},
        });
      }

      // Thông tin phim
      const movieInfo = {
        tenPhim: showtimes[0].tenPhim || "Chưa có tên",
        giaVe: showtimes[0].gia || 0,
      };

      // Nhóm suất chiếu theo ngày
      const showtimesGrouped = {};

      showtimes.forEach((st) => {
        const dateStr = new Date(st.ngayChieu).toISOString().split("T")[0];

        if (!showtimesGrouped[dateStr]) {
          showtimesGrouped[dateStr] = [];
        }

        showtimesGrouped[dateStr].push({
          id: st.id,
          time: formatTime(st.gioBatdau),
          auditoriumId: st.tblAuditoriumid,
          auditoriumName: st.sophong || "Phòng N/A",
          price: st.gia || 0,
        });
      });

      // Danh sách ngày có suất chiếu
      const showtimesByDate = Object.keys(showtimesGrouped).map((date) => ({
        date,
        label: formatDate(date),
      }));

      res.render("datve", {
        phong: showtimes.auditoriumId,
        movie: movieInfo,
        showtimesByDate,
        showtimesGrouped,
      });
    } catch (err) {
      console.error("❌ Lỗi truy vấn SQL tại Datve:", err);
      res.status(500).send("Lỗi máy chủ khi tải trang đặt vé.");
    }
  }

  // -------------------------------------------
  // GET /api/seats/occupied-seats?showtimeId=...
  // Lấy danh sách ghế đã đặt từ tblTicket theo showtimeId
  // -------------------------------------------
  async getOccupiedSeats(req, res) {
    const showtimeId = parseInt(req.query.showtimeId, 10);

    if (!showtimeId || isNaN(showtimeId)) {
      return res.status(400).json({
        success: false,
        message: "Thiếu hoặc sai ID suất chiếu.",
      });
    }

    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({
        success: false,
        message: "Lỗi kết nối CSDL.",
      });
    }

    try {
      // Query lấy ghế đã đặt từ tblTicket theo showtimeId
      const query = `
        SELECT s.hangghe + CAST(s.soghe AS NVARCHAR(10)) AS seatLabel
        FROM tblTicket t
        JOIN tblSeat s ON t.tblSeatid = s.id
        WHERE t.tblShowtimeid = @showtimeId
      `;

      const result = await pool
        .request()
        .input("showtimeId", sql.Int, showtimeId)
        .query(query);

      const occupiedSeats =
        result.recordset && result.recordset.length
          ? result.recordset.map((r) => r.seatLabel)
          : [];

      console.log(`✅ Ghế đã đặt cho showtime ${showtimeId}:`, occupiedSeats);

      res.json({
        success: true,
        occupiedSeats,
      });
    } catch (err) {
      console.error("❌ Lỗi truy vấn ghế đã đặt:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi tải trạng thái ghế.",
        occupiedSeats: [], // Trả về mảng rỗng để client vẫn hoạt động
      });
    }
  }

  // -------------------------------------------
  // POST /api/dat-ve/book
  // Đặt vé - Insert vào tblTicket
  // -------------------------------------------
  async bookSeats(req, res) {
    const { showtimeId, seats } = req.body;

    // Validate input
    if (!showtimeId || isNaN(parseInt(showtimeId, 10))) {
      return res.status(400).json({
        success: false,
        message: "Thiếu hoặc sai ID suất chiếu.",
      });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất 1 ghế.",
      });
    }

    const pool = await poolPromise;
    if (!pool) {
      return res.status(500).json({
        success: false,
        message: "Lỗi kết nối CSDL.",
      });
    }

    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      // TODO: Lấy userId từ session/auth thực tế
      const userId = req.session?.userId || 1; // Giá trị mặc định tạm thời

      const bookedSeats = [];

      for (const seatLabel of seats) {
        const hangghe = seatLabel.charAt(0).toUpperCase();
        const soghe = parseInt(seatLabel.substring(1));

        if (isNaN(soghe)) {
          throw new Error(`Ghế ${seatLabel} không hợp lệ.`);
        }

        // Tạo request mới cho mỗi ghế để tránh duplicate parameters
        const seatRequest = new sql.Request(transaction);

        // Query: Lấy thông tin ghế và kiểm tra ghế đã được đặt chưa
        const seatQuery = `
          SELECT 
            s.id AS SeatId, 
            st.gia AS Price,
            st.tblAuditoriumid AS AuditoriumId
          FROM tblSeat s
          JOIN tblShowtime st ON s.tblAuditoriumid = st.tblAuditoriumid
          WHERE s.hangghe = @hangghe 
            AND s.soghe = @soghe 
            AND st.id = @showtimeId
            AND NOT EXISTS (
              SELECT 1 
              FROM tblTicket t 
              WHERE t.tblShowtimeid = @showtimeId 
                AND t.tblSeatid = s.id
            )
        `;

        const seatResult = await seatRequest
          .input("hangghe", sql.NVarChar(1), hangghe)
          .input("soghe", sql.Int, soghe)
          .input("showtimeId", sql.Int, showtimeId)
          .query(seatQuery);

        // Kiểm tra ghế có tồn tại và còn trống không
        if (!seatResult.recordset || seatResult.recordset.length === 0) {
          throw new Error(
            `Ghế ${seatLabel} đã được đặt hoặc không tồn tại trong phòng chiếu này.`
          );
        }

        const seatId = seatResult.recordset[0].SeatId;
        const price = seatResult.recordset[0].Price;

        // Tạo request mới cho insert
        const insertRequest = new sql.Request(transaction);

        // Insert vào tblTicket
        const insertQuery = `
          INSERT INTO tblTicket 
            (tblShowtimeid, tblSeatid, gia)
          VALUES 
            (@showtimeId, @seatId, @price)
        `;

        await insertRequest
          .input("showtimeId", sql.Int, showtimeId)
          .input("seatId", sql.Int, seatId)
          .input("userId", sql.Int, userId)
          .input("price", sql.Decimal(10, 2), price)
          .query(insertQuery);

        bookedSeats.push({
          seatLabel,
          price,
        });

        console.log(
          `✅ Đã đặt ghế ${seatLabel} (ID: ${seatId}) - Giá: ${price}`
        );
      }

      await transaction.commit();

      const totalPrice = bookedSeats.reduce((sum, s) => sum + s.price, 0);

      res.json({
        success: true,
        message: "Đặt vé thành công!",
        seatsBooked: bookedSeats.map((s) => s.seatLabel),
        totalPrice: totalPrice,
      });
    } catch (err) {
      await transaction.rollback();
      console.error("❌ Lỗi Transaction đặt vé:", err.message);

      res.status(500).json({
        success: false,
        message: err.message || "Lỗi khi đặt vé. Vui lòng thử lại.",
      });
    }
  }
}

module.exports = new DatVeController();
