import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");

        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses");

        setError("Unable to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category)),
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      course.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      course.category === category;

    const matchesLevel =
      level === "All" ||
      course.level === level;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel
    );
  });

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-loading">
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <nav className="courses-navbar">
        <Link to="/dashboard" className="courses-brand">
          🎓 EduBridge
        </Link>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          Dashboard
        </Link>
      </nav>

      <main className="courses-container">
        <section className="courses-hero">
          <p>EXPLORE • LEARN • GROW</p>

          <h1>
            Discover Your Next Course
          </h1>

          <span>
            Learn the latest technologies and build
            skills for your future.
          </span>
        </section>

        <section className="course-filters">
          <div className="search-box">
            🔍
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) =>
              setLevel(event.target.value)
            }
          >
            <option value="All">All Levels</option>
            <option value="Beginner">
              Beginner
            </option>
            <option value="Intermediate">
              Intermediate
            </option>
            <option value="Advanced">
              Advanced
            </option>
          </select>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="courses-result">
          <p>
            Showing{" "}
            <strong>{filteredCourses.length}</strong>{" "}
            courses
          </p>
        </div>

        <section className="courses-grid">
          {filteredCourses.map((course) => (
            <div
              className="course-list-card"
              key={course._id}
            >
              <div
                className={`course-thumbnail ${course.thumbnail}`}
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

              <div className="course-list-content">
                <span className="course-list-category">
                  {course.category}
                </span>

                <h2>{course.title}</h2>

                <p className="course-description">
                  {course.description}
                </p>

                <div className="course-meta">
                  <span>
                    📊 {course.level}
                  </span>

                  <span>
                    ⏱️ {course.duration} hours
                  </span>
                </div>

                <div className="skills-list">
                  {course.skills
                    ?.slice(0, 3)
                    .map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}
                </div>

                <Link
                  to={`/courses/${course._id}`}
                  className="view-course-button"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </section>

        {filteredCourses.length === 0 && (
          <div className="no-courses">
            <h2>No courses found</h2>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Courses;