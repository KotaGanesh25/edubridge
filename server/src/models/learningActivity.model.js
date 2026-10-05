const mongoose = require("mongoose");

const learningActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    minutesLearned: {
      type: Number,
      default: 0,
    },

    lessonsCompleted: {
      type: Number,
      default: 0,
    },

    coursesWorkedOn: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One activity record per user per day
learningActivitySchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

const LearningActivity = mongoose.model(
  "LearningActivity",
  learningActivitySchema
);

module.exports = LearningActivity;