const datveController = require("../controllers/Datvecontroller");
const express = require("express");
const router = express.Router();

router.get("/",datveController.Datve );

module.exports = router;
