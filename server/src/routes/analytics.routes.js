const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  getAnalytics,
  recordActivity,
  recordLearningTime,
} = require("../controllers/analytics.controller");

const router = express.Router();

router.get(
  "/",
  protect,
  getAnalytics
);

router.post(
  "/activity",
  protect,
  recordActivity
);

router.post(
  "/time",
  protect,
  recordLearningTime
);

module.exports = router;