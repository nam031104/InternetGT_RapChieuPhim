const movieRoute = require("./movieRoutes");
const signinRoute = require("./signinRoutes");
const chiTietPhimRoute = require("./chiTietPhimRoutes");
const datveRoute = require("./datveRoutes");
const themLichChieu = require("./themLichChieuRoutes");
const themPhim = require("./themPhimRoutes");

function route(app) {
  app.use("/themPhim", themPhim);
  app.use("/api/showtimes", themLichChieu);
  app.use("/datve", datveRoute);
  app.use("/chiTietPhim", chiTietPhimRoute);
  app.use("/signin", signinRoute);
  app.use("/", movieRoute);
}

module.exports = route;
