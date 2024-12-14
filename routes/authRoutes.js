const express = require("express");
const router = express.Router();

// Correctly import authController (Ensure the path is correct)
const authController = require("../controllers/authController"); // Adjust the path if necessary

// Define routes and link to corresponding controller methods
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Add the new profile route (if necessary)
router.get("/profile", authController.getUserProfile); // This route should be handled in the controller

module.exports = router;
