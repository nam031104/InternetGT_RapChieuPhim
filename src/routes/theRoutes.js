const thecontroller = require("../controllers/TheControllers");
const express = require("express");
const router = express.Router();

router.get("/giave", thecontroller.giave);
router.get("/uudai", thecontroller.uudai);
router.get("/nhuongquyen", thecontroller.nhuongquyen);

module.exports = router;
