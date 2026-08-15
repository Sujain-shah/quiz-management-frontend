import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { admin } from "../api";
import Loading from "../components/Loading";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    admin.stats()
      .then(r => setStats(r.data.stats || r.data || {}))
      .catch(e => setError(e.response?.data?.message || "Dashboard stats endpoint not available"));
  }, []);

  const cards = [
    ["Total Students", stats.total_students ?? stats.totalStudents ?? 0],
    ["Total Quizzes", stats.total_quizzes ?? stats.totalQuizzes ?? 0],
    ["Published Quizzes", stats.published_quizzes ?? stats.publishedQuizzes ?? 0],
    ["Draft Quizzes", stats.draft_quizzes ?? stats.draftQuizzes ?? 0],
    ["Total Questions", stats.total_questions ?? stats.totalQuestions ?? 0],
    ["Quiz Attempts", stats.total_attempts ?? stats.totalAttempts ?? 0],
    ["Passed", stats.total_passed ?? stats.totalPassed ?? 0],
    ["Failed", stats.total_failed ?? stats.totalFailed ?? 0]
  ];

  return (
    <>
      <section className="hero">
        <div><span className="tag">ADMIN DASHBOARD</span><h2>Platform Overview</h2><p>Manage students, quizzes, categories and questions.</p></div>
        <Link className="primary" to="/admin/quizzes">Manage Quizzes</Link>
      </section>

      {error && <div className="alert error">{error}</div>}
      {!error && !Object.keys(stats).length ? <Loading /> : (
        <div className="stats-grid">
          {cards.map(([label, value]) => <div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
      )}

      <div className="quick-grid">
        <Link to="/admin/quizzes" className="quick-card"><b>Quiz Management</b><span>Create, edit, publish and delete quizzes →</span></Link>
        <Link to="/admin/categories" className="quick-card"><b>Categories</b><span>Manage quiz categories →</span></Link>
        <Link to="/admin/users" className="quick-card"><b>Students</b><span>View and manage students →</span></Link>
      </div>
    </>
  );
}