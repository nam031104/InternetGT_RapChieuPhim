const path = require("path");

class Datvecontroller {
  Datve(req, res) {
    res.render("datVe");
  }
}

module.exports = new Datvecontroller();
