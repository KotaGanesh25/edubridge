const express = require("express");

const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} = require("../controllers/course.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getCourses);

router.get("/:id", getCourseById);

// Protected routes
router.post("/", protect, createCourse);

router.post(
  "/:id/enroll",
  protect,
  enrollCourse
);

router.put("/:id", protect, updateCourse);

router.delete("/:id", protect, deleteCourse);


module.exports = router;