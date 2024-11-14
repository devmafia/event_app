const express = require("express");
const { authUserMiddleware } = require("../middleware/authMiddleware");

const {
    getUserdata,
    createUser,
    updateName,
    updateEmail,
    updatePassword,
    deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authUserMiddleware, getUserdata)
router.post("/", createUser)
router.put("/:id/update_name", authUserMiddleware, updateName)
router.put("/:id/update_email", authUserMiddleware, updateEmail)
router.put("/:id/update_password", authUserMiddleware, updatePassword)
router.delete("/", authUserMiddleware, deleteUser)

module.exports = router;