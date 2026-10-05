const User = require("../models/user.model");
const Course = require("../models/course.model");
const LearningActivity = require("../models/learningActivity.model");

// Get student's enrolled courses
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("enrolledCourses")
      .populate("enrolledCourses.course");

    res.status(200).json({
      success: true,
      courses: user.enrolledCourses,
    });
  } catch (error) {
    console.error(
      "Get my courses error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch your courses",
    });
  }
};

// Get learning progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("enrolledCourses")
      .populate("enrolledCourses.course");

    const enrollment = user.enrolledCourses.find(
      (item) =>
        item.course &&
        item.course._id.toString() === req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    res.status(200).json({
        success: true,
        progress: {
        course: enrollment.course,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedLessons:
            enrollment.completedLessons,
        completedLessonIds:
            enrollment.completedLessonIds || [],
        lastAccessedLesson:
            enrollment.lastAccessedLesson,
        completed: enrollment.completed,
    },
    });
    } catch (error) {
        console.error(
        "Get course progress error:",
        error.message
        );

    res.status(500).json({
      success: false,
      message: "Failed to fetch course progress",
    });
  }
};

// Complete a lesson
const completeLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const user = await User.findById(req.user._id);

    const enrollment = user.enrolledCourses.find(
      (item) =>
        item.course &&
        item.course.toString() === courseId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let lessonExists = false;

    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson._id.toString() === lessonId) {
          lessonExists = true;
        }
      });
    });

    if (!lessonExists) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    enrollment.lastAccessedLesson = lessonId;

    const alreadyCompleted =
        enrollment.completedLessonIds.some(
            (completedId) =>
                completedId.toString() === lessonId
        );
    if (!alreadyCompleted && enrollment.progress < 100) {
  const totalLessons = course.modules.reduce(
    (total, module) =>
      total + module.lessons.length,
    0
  );

  enrollment.completedLessonIds.push(
    lessonId
  );

  enrollment.completedLessons += 1;

  // Record learning activity
const today = new Date();

today.setHours(0, 0, 0, 0);

let activity = await LearningActivity.findOne({
  user: req.user._id,
  date: today,
});

if (!activity) {
  activity = await LearningActivity.create({
    user: req.user._id,
    date: today,
    minutesLearned: 0,
    lessonsCompleted: 1,
    coursesWorkedOn: 1,
  });
} else {
  activity.lessonsCompleted += 1;
  activity.coursesWorkedOn += 1;

  await activity.save();
}

  enrollment.progress = Math.min(
    100,
    Math.round(
      (enrollment.completedLessons /
        totalLessons) *
        100
    )
  );

  if (enrollment.progress === 100) {
    enrollment.completed = true;
  }
}
    

    await user.save();

    res.status(200).json({
      success: true,
      message: "Lesson completed",
      progress: enrollment.progress,
      completedLessons:
        enrollment.completedLessons,
    });
  } catch (error) {
    console.error(
      "Complete lesson error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update lesson progress",
    });
  }
};

module.exports = {
  getMyCourses,
  getCourseProgress,
  completeLesson,
};