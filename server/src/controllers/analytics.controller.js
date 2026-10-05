const User = require("../models/user.model");
const LearningActivity = require("../models/learningActivity.model");

// Get learning analytics for logged-in user
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user
    const user = await User.findById(userId).select(
      "learningStats enrolledCourses"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all learning activities
    const activities = await LearningActivity.find({
      user: userId,
    }).sort({ date: 1 });

    // Calculate total learning minutes
    const totalMinutes = activities.reduce(
      (total, activity) =>
        total + activity.minutesLearned,
      0
    );

    // Calculate total lessons completed
    const totalLessonsCompleted = activities.reduce(
      (total, activity) =>
        total + activity.lessonsCompleted,
      0
    );

    // Calculate current streak
    const currentStreak = calculateCurrentStreak(
      activities
    );

    // Count completed courses
    const coursesCompleted =
      user.enrolledCourses.filter(
        (course) => course.completed
      ).length;

    res.status(200).json({
      success: true,

      analytics: {
        totalMinutes,
        totalLessonsCompleted,
        currentStreak,
        coursesCompleted,
        dailyActivity: activities,
      },
    });
  } catch (error) {
    console.error(
      "Get analytics error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};


// Calculate current learning streak
const calculateCurrentStreak = (activities) => {
  if (!activities.length) {
    return 0;
  }

  // Convert activity dates to YYYY-MM-DD
  const dates = activities
    .filter(
      (activity) => activity.minutesLearned > 0
    )
    .map((activity) =>
      new Date(activity.date)
        .toISOString()
        .split("T")[0]
    );

  if (!dates.length) {
    return 0;
  }

  // Remove duplicate dates
  const uniqueDates = [...new Set(dates)];

  // Sort newest first
  uniqueDates.sort(
    (a, b) =>
      new Date(b) - new Date(a)
  );

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  let streak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today);

    expectedDate.setDate(
      today.getDate() - i
    );

    const expectedDateString =
      expectedDate
        .toISOString()
        .split("T")[0];

    if (
      uniqueDates[i] ===
      expectedDateString
    ) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Record learning activity
const recordActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      minutesLearned = 0,
      lessonsCompleted = 0,
      coursesWorkedOn = 0,
    } = req.body;

    // Get today's date
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // Find today's activity
    let activity = await LearningActivity.findOne({
      user: userId,
      date: today,
    });

    // Create today's activity if it doesn't exist
    if (!activity) {
      activity = await LearningActivity.create({
        user: userId,
        date: today,
        minutesLearned,
        lessonsCompleted,
        coursesWorkedOn,
      });
    } else {
      // Add new activity to today's record
      activity.minutesLearned += Number(
        minutesLearned
      );

      activity.lessonsCompleted += Number(
        lessonsCompleted
      );

      activity.coursesWorkedOn += Number(
        coursesWorkedOn
      );

      await activity.save();
    }

    res.status(200).json({
      success: true,
      message: "Learning activity recorded",
      activity,
    });
  } catch (error) {
    console.error(
      "Record activity error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to record learning activity",
    });
  }
};

// Record learning time
const recordLearningTime = async (req, res) => {
  try {
    const userId = req.user._id;

    const { minutes } = req.body;

    if (!minutes || Number(minutes) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid learning minutes are required",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    let activity = await LearningActivity.findOne({
      user: userId,
      date: today,
    });

    if (!activity) {
      activity = await LearningActivity.create({
        user: userId,
        date: today,
        minutesLearned: Number(minutes),
        lessonsCompleted: 0,
        coursesWorkedOn: 0,
      });
    } else {
      activity.minutesLearned += Number(minutes);

      await activity.save();
    }

    // Update user's total watched time
    const user = await User.findById(userId);

    if (user) {
      user.learningStats.timeWatched += Number(minutes);

      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Learning time recorded",
      minutesAdded: Number(minutes),
      totalMinutes: activity.minutesLearned,
    });
  } catch (error) {
    console.error(
      "Record learning time error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to record learning time",
    });
  }
};

module.exports = {
  getAnalytics,
  recordActivity,
  recordLearningTime,
};