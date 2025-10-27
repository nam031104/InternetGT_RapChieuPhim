const path = require("path");

class signinController {
  dangnhap(req, res) {
    res.sendFile(path.join(__dirname, "../public/signin.html"));
  }

  Nhan(req, res) {
    console.log(req.body);
    res.redirect("/");
  }
}

module.exports = new signinController();
