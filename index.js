const express = require("express");
const path = require("path");
const cors = require("cors");
const route = require("./routes");

const app = express();
const PORT = 3000;

//app.use(cors());
app.use(express.json());

// Dùng frontend ở thư mục public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

route(app);

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
