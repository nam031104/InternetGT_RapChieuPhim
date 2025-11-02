const express = require("express");
const { create } = require("express-handlebars");
const session = require("express-session");
const path = require("path");
const route = require("./routes");

const app = express();
const port = 3008;

// ==========================================
// 1. Body Parser (PHẢI ĐẶT TRƯỚC SESSION)
// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// 2. Session Configuration
// ==========================================
app.use(
  session({
    secret: "nptcinema_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 24 giờ
      httpOnly: true,
    },
  })
);

// ==========================================
// 3. Handlebars Configuration
// ==========================================
const hbs = create({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: {
    json: (context) => JSON.stringify(context),
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./resources/views"));

// ==========================================
// 4. Static Files
// ==========================================
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// 5. User Locals Middleware (SAU SESSION)
// ==========================================
function userLocals(req, res, next) {
  console.log("🔍 Middleware userLocals đang chạy...");
  console.log("📦 req.session:", req.session);
  console.log("👤 req.session.user:", req.session.user);

  res.locals.user = req.session.user || null;

  console.log("✅ res.locals.user:", res.locals.user);

  next();
}

app.use(userLocals);

// ==========================================
// 6. Routes
// ==========================================
route(app);

// ==========================================
// 7. Start Server
// ==========================================
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
