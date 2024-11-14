const express = require("express");
const { bookEvents, getBookings, deleteBooking } = require("../controllers/bookingController");
const { authUserMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/bookEvents", bookEvents);
router.get("/bookings", authUserMiddleware, getBookings);
router.delete("/:id", authUserMiddleware, deleteBooking);

module.exports = router;

