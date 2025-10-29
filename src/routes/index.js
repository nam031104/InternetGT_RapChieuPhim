const movieRoute = require("./movieRoutes");
const signinRoute = require("./signinRoutes");
const chiTietPhimRoute = require("./chiTietPhimRoutes");
const datveRoute = require("./datveRoutes");

function route(app) {
  app.use("/datve", datveRoute);
  app.use("/chiTietPhim", chiTietPhimRoute);
  app.use("/signin", signinRoute);
  app.use("/", movieRoute);
}

module.exports = route;
