const express = require("express");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Get current logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;