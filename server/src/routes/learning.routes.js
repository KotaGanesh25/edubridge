const express = require("express");

const protect = require("../middleware/auth.middleware");

const {
  getMyCourses,
  getCourseProgress,
  completeLesson,
} = require("../controllers/learning.controller");

const router = express.Router();

router.get(
  "/my-courses",
  protect,
  getMyCourses
);

router.get(
  "/courses/:id/progress",
  protect,
  getCourseProgress
);

router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
  protect,
  completeLesson
);

module.exports = router;