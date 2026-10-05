import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyLearning from "./pages/MyLearning";
import Learning from "./pages/Learning";
import Chatbot from "./pages/Chatbot";


/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until authentication state is restored
  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading EduBridge...</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // User is authenticated
  return children;
}


/* ================= APPLICATION ROUTES ================= */

function App() {
  return (
    <Routes>

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ================= STUDENT DASHBOARD ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* ================= COURSES ================= */}

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />


      {/* ================= MY LEARNING ================= */}

      <Route
        path="/my-learning"
        element={
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        }
      />


      {/* ================= LEARNING PLAYER ================= */}

      <Route
        path="/learn/:courseId"
        element={
          <ProtectedRoute>
            <Learning />
          </ProtectedRoute>
        }
      />


      {/* ================= AI CHATBOT ================= */}

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />


      {/* ================= UNKNOWN ROUTES ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;