const express = require("express");

const { authAdminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/imageMulter");

const { loginAdmin } = require("../controllers/authController");
const {
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');

const router = express.Router();

router.post("/login", loginAdmin)
router.post('/', authAdminMiddleware, upload.single('image'), createEvent);
router.put('/:id', authAdminMiddleware, upload.single('image'), updateEvent);
router.delete('/:id', authAdminMiddleware, deleteEvent);

module.exports = router;

