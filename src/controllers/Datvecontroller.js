const path = require("path");

class Datvecontroller {
  Datve(req, res) {
    res.render("datve");
  }

  
}

module.exports = new Datvecontroller();