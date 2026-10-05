import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function Learning() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);

  const [selectedLesson, setSelectedLesson] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLearningData = async () => {
      try {
        const [courseResponse, progressResponse] =
          await Promise.all([
            api.get(`/courses/${courseId}`),
            api.get(
              `/learning/courses/${courseId}/progress`
            ),
          ]);

        const loadedCourse =
          courseResponse.data.course;

        setCourse(loadedCourse);
        setProgress(progressResponse.data.progress);

        // Select the last accessed lesson if available
        let initialLesson = null;

        if (
          progressResponse.data.progress
            .lastAccessedLesson
        ) {
          for (const module of loadedCourse.modules) {
            const lesson = module.lessons.find(
              (item) =>
                item._id ===
                progressResponse.data.progress
                  .lastAccessedLesson
            );

            if (lesson) {
              initialLesson = lesson;
              break;
            }
          }
        }

        // Otherwise select first lesson
        if (!initialLesson) {
          initialLesson =
            loadedCourse.modules?.[0]?.lessons?.[0];
        }

        setSelectedLesson(initialLesson);
      } catch (error) {
        console.error(
          "Failed to load learning page"
        );

        setError(
          error.response?.data?.message ||
            "Unable to load this course."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLearningData();
  }, [courseId]);

  const getAllLessons = () => {
    if (!course?.modules) {
      return [];
    }

    return course.modules.flatMap(
      (module) => module.lessons
    );
  };

  const getCurrentLessonIndex = () => {
    const lessons = getAllLessons();

    return lessons.findIndex(
      (lesson) =>
        lesson._id === selectedLesson?._id
    );
  };

  const goToNextLesson = () => {
    const lessons = getAllLessons();

    const currentIndex =
      getCurrentLessonIndex();

    if (
      currentIndex >= 0 &&
      currentIndex < lessons.length - 1
    ) {
      setSelectedLesson(
        lessons[currentIndex + 1]
      );
    }
  };

  const goToPreviousLesson = () => {
    const lessons = getAllLessons();

    const currentIndex =
      getCurrentLessonIndex();

    if (currentIndex > 0) {
      setSelectedLesson(
        lessons[currentIndex - 1]
      );
    }
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson) {
      return;
    }

    try {
      setCompleting(true);

      const response = await api.post(
        `/learning/courses/${courseId}/lessons/${selectedLesson._id}/complete`
      );

      setProgress((previous) => ({
        ...previous,
        progress: response.data.progress,
        completedLessons:
          response.data.completedLessons,
      }));
    } catch (error) {
      console.error(
        "Failed to complete lesson"
      );

      alert(
        error.response?.data?.message ||
          "Unable to update progress"
      );
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="learning-loading">
        Loading your lesson...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="learning-loading">
        <h2>
          {error || "Course not found"}
        </h2>

        <Link to="/my-learning">
          Back to My Learning
        </Link>
      </div>
    );
  }

  const allLessons = getAllLessons();

  const currentLessonIndex =
    getCurrentLessonIndex();

  const isLastLesson =
    currentLessonIndex ===
    allLessons.length - 1;

  return (
    <div className="learning-page">

      <nav className="learning-navbar">

        <Link
          to="/my-learning"
          className="learning-brand"
        >
          🎓 EduBridge
        </Link>

        <div className="learning-course-title">
          {course.title}
        </div>

        <Link
          to="/dashboard"
          className="learning-dashboard-link"
        >
          Dashboard
        </Link>

      </nav>

      <div className="learning-progress-header">

        <div>
          <span>Course Progress</span>

          <strong>
            {progress?.progress || 0}%
          </strong>
        </div>

        <div className="course-progress-track">
          <div
            style={{
              width: `${
                progress?.progress || 0
              }%`,
            }}
          ></div>
        </div>

      </div>

      <main className="learning-layout">

        <aside className="learning-sidebar">

          <h2>Course Content</h2>

          <p className="sidebar-progress">
            {progress?.completedLessons || 0} of{" "}
            {allLessons.length} lessons completed
          </p>

          {course.modules?.map(
            (module, moduleIndex) => (
              <div
                className="learning-module"
                key={module._id}
              >

                <div className="learning-module-title">
                  <span>
                    Module {moduleIndex + 1}
                  </span>

                  <strong>
                    {module.title}
                  </strong>
                </div>

                <div className="learning-lessons">

                  {module.lessons?.map(
                    (lesson, lessonIndex) => {

                      const isSelected =
                        selectedLesson?._id ===
                        lesson._id;

                      const isCompleted =
                        progress?.completedLessonIds?.some(
                          (completedId) =>
                            completedId ===
                              lesson._id ||
                            completedId?.toString() ===
                              lesson._id
                        );

                      return (
                        <button
                          key={lesson._id}
                          className={`learning-lesson ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedLesson(
                              lesson
                            )
                          }
                        >

                          <span className="lesson-check">
                            {isCompleted
                              ? "✓"
                              : lessonIndex + 1}
                          </span>

                          <span className="learning-lesson-name">
                            {lesson.title}
                          </span>

                          <span className="learning-lesson-time">
                            {lesson.duration}m
                          </span>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )
          )}

        </aside>

        <section className="lesson-area">

          <div className="lesson-content-card">

            <div className="lesson-content-header">

              <span>
                Lesson {currentLessonIndex + 1}
              </span>

              <h1>
                {selectedLesson?.title}
              </h1>

            </div>

            <div className="lesson-video-placeholder">

              <div className="video-icon">
                ▶
              </div>

              <h2>
                {selectedLesson?.title}
              </h2>

              <p>
                Video lesson content will be
                available here.
              </p>

            </div>

            <div className="lesson-description">

              <h2>About this lesson</h2>

              <p>
                {selectedLesson?.description ||
                  "Complete this lesson to continue your learning journey."}
              </p>

            </div>

            <div className="lesson-actions">

              <button
                className="previous-lesson-button"
                onClick={goToPreviousLesson}
                disabled={
                  currentLessonIndex <= 0
                }
              >
                ← Previous
              </button>

              <button
                className="complete-lesson-button"
                onClick={handleCompleteLesson}
                disabled={completing}
              >
                {completing
                  ? "Saving..."
                  : "✓ Mark as Complete"}
              </button>

              <button
                className="next-lesson-button"
                onClick={goToNextLesson}
                disabled={isLastLesson}
              >
                Next →
              </button>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Learning;