const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },

    profileImage: {
      type: String,
      default: "",
    },
    
    
    
    enrolledCourses: [
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    progress: {
      type: Number,
      default: 0,
    },

    completedLessons: {
      type: Number,
      default: 0,
    },

    completedLessonIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
],


    learningStats: {
      coursesCompleted: {
        type: Number,
        default: 0,
      },

      timeWatched: {
        type: Number,
        default: 0,
      },

      currentStreak: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;