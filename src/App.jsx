import { Navigate, Route, Routes } from "react-router-dom";
import { getToken, getUser, roleOf } from "./auth";
import AdminAnalytics from "./pages/AdminAnalytics";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import QuizList from "./pages/QuizList";
import QuizDetails from "./pages/QuizDetails";
import QuizAttempt from "./pages/QuizAttempt";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import AdminQuestions from "./pages/AdminQuestions";
import Layout from "./components/Layout";

function Protected({ children, role }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  const userRole = roleOf(getUser());
  if (role && userRole !== role) {
    return <Navigate to={userRole === "ADMIN" ? "/admin" : "/student"} replace />;
  }
  return children;
}

function HomeRedirect() {
  if (!getToken()) return <Navigate to="/login" replace />;
  return roleOf(getUser()) === "ADMIN"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/student" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Protected role="STUDENT"><Layout /></Protected>}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/quizzes" element={<QuizList />} />
        <Route path="/student/quizzes/:id" element={<QuizDetails />} />
        <Route path="/student/quiz/:quizId/attempt/:attemptId" element={<QuizAttempt />} />
        <Route path="/student/result/:attemptId" element={<Result />} />
      </Route>

      <Route element={<Protected role="ADMIN"><Layout /></Protected>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/questions/:quizId" element={<AdminQuestions />} />
        <Route
          path="/admin/analytics"
          element={<AdminAnalytics />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}