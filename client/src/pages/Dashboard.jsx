import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Generate GitHub-style learning activity squares
const generateActivityGrid = (activities) => {
  const activityMap = {};

  activities.forEach((activity) => {
    const date = new Date(activity.date)
      .toISOString()
      .split("T")[0];

    activityMap[date] = activity.minutesLearned || 0;
  });

  const days = [];

  for (let i = 89; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    date.setDate(date.getDate() - i);

    const dateString = date
      .toISOString()
      .split("T")[0];

    const minutes = activityMap[dateString] || 0;

    let level = 0;

    if (minutes > 0 && minutes < 15) {
      level = 1;
    } else if (minutes >= 15 && minutes < 30) {
      level = 2;
    } else if (minutes >= 30 && minutes < 60) {
      level = 3;
    } else if (minutes >= 60) {
      level = 4;
    }

    days.push({
      date: dateString,
      minutes,
      level,
    });
  }

  return days;
};

function Dashboard() {
  const { user, logout } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [myCourses, setMyCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // ================================
  // Fetch Analytics
  // ================================

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/analytics");

        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error(
          "Failed to load analytics:",
          error
        );
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ================================
  // Fetch Enrolled Courses
  // ================================

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get(
          "/learning/my-courses"
        );

        setMyCourses(response.data.courses || []);
      } catch (error) {
        console.error(
          "Failed to load enrolled courses:",
          error
        );
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // ================================
  // Find Course To Continue
  // ================================

  const continueCourse =
    myCourses.find(
      (item) => !item.completed
    ) ||
    myCourses[0] ||
    null;

  // ================================
  // Recommended Courses
  // ================================

  const recommendedCourses = [
    {
      title: "Node.js and Express",
      category: "Backend Development",
      description:
        "Learn how to build backend applications and REST APIs.",
      icon: "🟢",
    },
    {
      title: "MongoDB Fundamentals",
      category: "Database",
      description:
        "Learn MongoDB databases, collections, queries and more.",
      icon: "🍃",
    },
    {
      title: "Generative AI",
      category: "Artificial Intelligence",
      description:
        "Understand LLMs, prompts and modern Generative AI systems.",
      icon: "🤖",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="dashboard-navbar">

        {/* Brand */}
        <div className="dashboard-brand">
          EduBridge
        </div>

        {/* Navigation */}
        <div className="dashboard-nav-links">

          <Link
            to="/dashboard"
            className="dashboard-nav-link"
          >
            Dashboard
          </Link>

          <Link
            to="/courses"
            className="dashboard-nav-link"
          >
            Explore Courses
          </Link>

          <Link
            to="/my-learning"
            className="dashboard-nav-link"
          >
            My Learning
          </Link>

          <Link
            to="/chat"
            className="dashboard-nav-link"
          >
            🤖 AI Assistant
          </Link>

          <span className="dashboard-user">
            Hi, {user?.name || "Learner"}
          </span>

          <button
            className="dashboard-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="dashboard-content">

        {/* ================================
            WELCOME SECTION
        ================================= */}

        <section className="dashboard-welcome">

          <div>

            <h1>
              Welcome back,{" "}
              {user?.name || "Learner"} 👋
            </h1>

            <p>
              Keep learning and continue building
              your skills.
            </p>

          </div>

          <Link
            to="/courses"
            className="dashboard-explore-button"
          >
            Explore Courses
          </Link>

        </section>


        {/* ================================
            STATISTICS
        ================================= */}

        <section className="stats-grid">

          {/* Courses Completed */}

          <div className="stat-card">

            <div className="stat-icon">
              🎓
            </div>

            <div>

              <h3>
                Courses Completed
              </h3>

              <p>
                {analyticsLoading
                  ? "..."
                  : analytics?.coursesCompleted || 0}
              </p>

            </div>

          </div>


          {/* Time Watched */}

          <div className="stat-card">

            <div className="stat-icon">
              ⏱️
            </div>

            <div>

              <h3>
                Time Watched
              </h3>

              <p>
                {analyticsLoading
                  ? "..."
                  : `${
                      analytics?.totalMinutes || 0
                    } min`}
              </p>

            </div>

          </div>


          {/* Current Streak */}

          <div className="stat-card">

            <div className="stat-icon">
              🔥
            </div>

            <div>

              <h3>
                Current Streak
              </h3>

              <p>
                {analyticsLoading
                  ? "..."
                  : `${
                      analytics?.currentStreak || 0
                    } days`}
              </p>

            </div>

          </div>


          {/* Learning Goal */}

          <div className="stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>

              <h3>
                Learning Goal
              </h3>

              <p>
                On Track
              </p>

            </div>

          </div>

        </section>


        {/* ================================
            LEARNING ACTIVITY
        ================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Learning Activity
              </h2>

              <p>
                Your learning activity over
                the last 90 days
              </p>

            </div>

          </div>


          <div className="activity-container">

            <div className="activity-grid">

              {generateActivityGrid(
                analytics?.dailyActivity || []
              ).map((day, index) => (

                <div
                  key={index}
                  className={`activity-square activity-level-${day.level}`}
                  title={`${day.date}: ${day.minutes} minutes`}
                ></div>

              ))}

            </div>

          </div>

        </section>


        {/* ================================
            CONTINUE LEARNING
        ================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Continue Learning
              </h2>

              <p>
                Pick up where you left off
              </p>

            </div>

            <Link to="/my-learning">
              View All
            </Link>

          </div>


          {/* Loading */}

          {coursesLoading ? (

            <div className="course-card">

              <div className="course-card-content">

                <p>
                  Loading your courses...
                </p>

              </div>

            </div>

          ) : continueCourse ? (

            /* Enrolled Course */

            <div className="course-card">

              <div className="course-card-image">
                📚
              </div>


              <div className="course-card-content">

                <span className="course-category">
                  {continueCourse.course?.category ||
                    "Learning"}
                </span>


                <h3>
                  {continueCourse.course?.title ||
                    "Continue Learning"}
                </h3>


                <p>
                  {continueCourse.course?.description ||
                    "Continue your learning journey."}
                </p>


                {/* Progress */}

                <div className="progress-info">

                  <span>
                    Progress
                  </span>

                  <span>
                    {continueCourse.progress || 0}%
                  </span>

                </div>


                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        continueCourse.progress || 0
                      }%`,
                    }}
                  ></div>

                </div>


                {/* Continue Button */}

                <Link
                  to={`/learn/${continueCourse.course?._id}`}
                  className="continue-button"
                >
                  Continue Learning
                </Link>

              </div>

            </div>

          ) : (

            /* No Enrolled Course */

            <div className="course-card">

              <div className="course-card-content">

                <h3>
                  Start your learning journey
                </h3>

                <p>
                  You haven't enrolled in a
                  course yet.
                </p>

                <Link
                  to="/courses"
                  className="continue-button"
                >
                  Explore Courses
                </Link>

              </div>

            </div>

          )}

        </section>


        {/* ================================
            RECOMMENDED COURSES
        ================================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Recommended For You
              </h2>

              <p>
                Courses that can help you
                continue your learning journey
              </p>

            </div>

            <Link to="/courses">
              View All
            </Link>

          </div>


          <div className="recommended-grid">

            {recommendedCourses.map(
              (course, index) => (

                <div
                  className="recommended-card"
                  key={index}
                >

                  <div className="recommended-icon">
                    {course.icon}
                  </div>

                  <span>
                    {course.category}
                  </span>

                  <h3>
                    {course.title}
                  </h3>

                  <p>
                    {course.description}
                  </p>

                  <Link to="/courses">
                    View Course →
                  </Link>

                </div>

              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;