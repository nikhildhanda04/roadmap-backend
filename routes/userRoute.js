const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/userController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/check').post(validateTokenHandler, currentUser);

module.exports = router;