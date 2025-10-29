const express = require("express");
const { create } = require("express-handlebars");
const app = express();
const port = 3001;
const path = require("path");
const route = require("./routes");
const session = require("express-session");

app.use(
  session({
    secret: "nptcinema_secret_key", // 🔑 chuỗi bí mật tùy ý
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // ⚠️ nếu dùng HTTPS thì mới để true
  })
);

const hbs = create({
  defaultLayout: "main",
  extname: ".hbs",
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./resources/views"));

app.use(express.static(path.join(__dirname, "public")));

route(app);

app.listen(port, console.log(`dang chay tai http://localhost:${port}`));
