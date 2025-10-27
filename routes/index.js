const movieRoute = require("./movieRoutes");
const signinRoute = require("./signinRoutes");
const chiTietPhimRoute = require("./chiTietPhimRoutes");

function route(app) {
  app.use("/chiTietPhim", chiTietPhimRoute);
  app.use("/signin", signinRoute);
  app.use("/", movieRoute);
}

module.exports = route;
