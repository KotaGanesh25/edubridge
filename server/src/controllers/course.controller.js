const Course = require("../models/course.model");
const User = require("../models/user.model");

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      isPublished: true,
    })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// Get single course
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

// Create course
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      thumbnail,
      duration,
      skills,
      modules,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      thumbnail,
      duration,
      skills,
      modules,
      instructor: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

// Enroll in course
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const user = await User.findById(req.user._id);

    const alreadyEnrolled =
      user.enrolledCourses.some(
        (item) =>
          item.course.toString() === courseId
      );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    user.enrolledCourses.push({
      course: courseId,
    });

    await user.save();

    course.studentsEnrolled += 1;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error(
      "Enrollment error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
};


module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
};