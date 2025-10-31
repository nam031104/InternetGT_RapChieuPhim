const datveController = require("../controllers/Datvecontroller");
const express = require("express");
const router = express.Router();

router.get("/seats/occupied-seats", datveController.getOccupiedSeats);
router.post("/dat-ve/book", datveController.bookSeats);

module.exports = router;
