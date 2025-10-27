const movieController = require("../controllers/movieController");
const express = require("express");
const router = express.Router();

router.get("/data", movieController.hienthi);
router.get("/", movieController.trangchu);

module.exports = router;
