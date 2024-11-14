const express = require("express");

const {
    getAllEvents,
    getEvent,
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', getAllEvents);
router.get("/:id", getEvent);

module.exports = router;