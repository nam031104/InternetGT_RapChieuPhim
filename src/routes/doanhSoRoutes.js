const DoanhSoController = require("../controllers/DoanhSoController");
const express = require("express");
const router = express.Router();

router.get("/", DoanhSoController.trangchu);

module.exports = router;
