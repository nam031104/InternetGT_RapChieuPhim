const datveController = require("../controllers/DatVeController");
const express = require("express");
const router = express.Router();

router.get("/:movieId", datveController.Datve);
router.get("/", (req, res) => {
  res.send(`
    <script>
      alert("Hãy chọn phim trước rồi đặt vé!");
      window.location.href = "/customer";
    </script>
  `);
});

module.exports = router;
