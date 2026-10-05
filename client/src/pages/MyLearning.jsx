import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get(
          "/learning/my-courses"
        );

        setCourses(response.data.courses);
      } catch (error) {
        console.error(
          "Failed to fetch enrolled courses"
        );

        setError(
          "Unable to load your courses."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="my-learning-loading">
        Loading your learning...
      </div>
    );
  }

  return (
    <div className="my-learning-page">

      <nav className="courses-navbar">
        <Link
          to="/dashboard"
          className="courses-brand"
        >
          🎓 EduBridge
        </Link>

        <Link
          to="/courses"
          className="back-dashboard"
        >
          Explore Courses
        </Link>
      </nav>

      <main className="my-learning-container">

        <section className="my-learning-header">
          <p>MY LEARNING</p>

          <h1>
            Continue Your Learning
          </h1>

          <span>
            Pick up where you left off.
          </span>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-learning">

            <div className="empty-icon">
              📚
            </div>

            <h2>
              No courses yet
            </h2>

            <p>
              Start learning by enrolling in
              your first course.
            </p>

            <Link
              to="/courses"
              className="browse-learning-button"
            >
              Browse Courses
            </Link>

          </div>
        ) : (
          <section className="my-courses-grid">

            {courses.map((item) => {

              const course = item.course;

              if (!course) {
                return null;
              }

              return (
                <div
                  className="my-course-card"
                  key={course._id}
                >

                  <div
                    className={`my-course-thumbnail ${course.thumbnail}`}
                  >
                    {course.thumbnail === "react" &&
                      "⚛️"}

                    {course.thumbnail === "node" &&
                      "🟢"}

                    {course.thumbnail === "mongodb" &&
                      "🍃"}

                    {course.thumbnail === "python" &&
                      "🐍"}

                    {course.thumbnail === "ml" &&
                      "🧠"}

                    {course.thumbnail === "genai" &&
                      "🤖"}

                    {course.thumbnail === "rag" &&
                      "🔎"}

                    {course.thumbnail === "aws" &&
                      "☁️"}

                    {course.thumbnail === "docker" &&
                      "🐳"}
                  </div>

                  <div className="my-course-content">

                    <span>
                      {course.category}
                    </span>

                    <h2>
                      {course.title}
                    </h2>

                    <div className="progress-header">
                      <span>
                        Progress
                      </span>

                      <strong>
                        {item.progress || 0}%
                      </strong>
                    </div>

                    <div className="learning-progress-bar">
                      <div
                        style={{
                          width: `${
                            item.progress || 0
                          }%`,
                        }}
                      ></div>
                    </div>

                    <p className="lesson-count">
                      {item.completedLessons || 0} lessons
                      completed
                    </p>

                    <Link
                      to={`/learn/${course._id}`}
                      className="continue-learning-button"
                    >
                      {item.progress > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </Link>

                  </div>

                </div>
              );
            })}

          </section>
        )}

      </main>
    </div>
  );
}

export default MyLearning;