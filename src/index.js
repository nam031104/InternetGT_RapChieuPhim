const express = require("express");
const { create } = require("express-handlebars");
const app = express();
const port = 3000;
const path = require("path");
const route = require("./routes");

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

app.get("/", (req, res) => {
  res.render("home");
});

route(app);

app.listen(port, console.log(`dang chay tai http://localhost:${port}`));
