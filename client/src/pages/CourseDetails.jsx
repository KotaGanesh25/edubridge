import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);

        setCourse(response.data.course);
      } catch (error) {
        console.error("Failed to fetch course");

        setError("Unable to load this course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
  try {
    setEnrolling(true);
    setEnrollMessage("");

    const response = await api.post(
      `/courses/${id}/enroll`
    );

    setEnrollMessage(response.data.message);

    setCourse((previousCourse) => ({
      ...previousCourse,
      studentsEnrolled:
        previousCourse.studentsEnrolled + 1,
    }));
  } catch (error) {
    setEnrollMessage(
      error.response?.data?.message ||
        "Enrollment failed"
    );
  } finally {
    setEnrolling(false);
  }
};
  if (loading) {
    return (
      <div className="course-details-loading">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-details-loading">
        <h2>{error || "Course not found"}</h2>

        <Link to="/courses">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="course-details-page">
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
          All Courses
        </Link>
      </nav>

      <main className="course-details-container">

        <Link
          to="/courses"
          className="course-back-link"
        >
          ← Back to Courses
        </Link>

        <section className="course-details-hero">

          <div
            className={`details-thumbnail ${course.thumbnail}`}
          >
            {course.thumbnail === "react" && "⚛️"}
            {course.thumbnail === "node" && "🟢"}
            {course.thumbnail === "mongodb" && "🍃"}
            {course.thumbnail === "python" && "🐍"}
            {course.thumbnail === "ml" && "🧠"}
            {course.thumbnail === "genai" && "🤖"}
            {course.thumbnail === "rag" && "🔎"}
            {course.thumbnail === "aws" && "☁️"}
            {course.thumbnail === "docker" && "🐳"}
          </div>

          <div className="course-details-info">

            <span className="course-details-category">
              {course.category}
            </span>

            <h1>{course.title}</h1>

            <p className="course-details-description">
              {course.description}
            </p>

            <div className="details-meta">

              <span>
                📊 {course.level}
              </span>

              <span>
                ⏱️ {course.duration} hours
              </span>

              <span>
                👨‍🎓 {course.studentsEnrolled} students
              </span>

            </div>

            {course.instructor && (
              <p className="instructor-name">
                Instructor:{" "}
                <strong>
                  {course.instructor.name}
                </strong>
              </p>
            )}

            <button
              className="enroll-button"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>
            {enrollMessage && (
                <p className="enroll-message">
                    {enrollMessage}
                </p>
            )}

          </div>

        </section>

        <section className="course-details-section">

          <h2>What You'll Learn</h2>

          <div className="skills-detail-list">

            {course.skills?.map((skill) => (
              <div
                className="skill-detail"
                key={skill}
              >
                ✓ {skill}
              </div>
            ))}

          </div>

        </section>

        <section className="course-details-section">

          <h2>Course Content</h2>

          <p className="content-summary">
            {course.modules?.length || 0} modules
          </p>

          <div className="modules-list">

            {course.modules?.map(
              (module, moduleIndex) => (
                <div
                  className="module-card"
                  key={module._id || moduleIndex}
                >

                  <div className="module-header">

                    <div>
                      <span>
                        Module {moduleIndex + 1}
                      </span>

                      <h3>
                        {module.title}
                      </h3>
                    </div>

                    <span>
                      {module.lessons?.length || 0} lessons
                    </span>

                  </div>

                  <div className="lessons-list">

                    {module.lessons?.map(
                      (lesson, lessonIndex) => (
                        <div
                          className="lesson-item"
                          key={
                            lesson._id ||
                            lessonIndex
                          }
                        >

                          <span className="lesson-number">
                            {lessonIndex + 1}
                          </span>

                          <span className="lesson-title">
                            {lesson.title}
                          </span>

                          <span className="lesson-duration">
                            {lesson.duration} min
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default CourseDetails;