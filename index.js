const express = require("express");
const path = require("path");
const cors = require("cors");
const route = require("./routes");
const { connectDB } = require("./config/db");

const app = express();
const PORT = 3000;

//app.use(cors());
app.use(express.json());

// Dùng frontend ở thư mục public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// API routes (prefix /api)
// app.use("/api/movies", movieRoutes);
route(app);

// thu ket noi dtb
// connectDB();

// Một route thử truy vấn
// app.get("/data", async (req, res) => {
//   try {
//     const pool = await connectDB();
//     const result = await pool.request().query("SELECT * FROM Phim");
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("❌ Lỗi truy vấn:", err);
//     res.status(500).send("Lỗi server");
//   }
// });

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
