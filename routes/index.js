const movieRoute = require("./movieRoutes");
const signinRoute = require("./signinRoutes");

function route(app) {
  app.use("/signin", signinRoute);
  app.use("/", movieRoute);
}

module.exports = route;
