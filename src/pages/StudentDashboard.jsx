import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { quizzes, student } from "../api";
import { getUser } from "../auth";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function StudentDashboard() {
  const [list, setList] = useState([]);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUser();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [quizResponse, dashboardResponse] =
          await Promise.all([
            quizzes.published(),
            student.dashboard()
          ]);

        setList(
          quizResponse.data.quizzes || []
        );

        setStats(
          dashboardResponse.data.statistics
        );

        setHistory(
          dashboardResponse.data.history || []
        );

        setPerformance(
          dashboardResponse.data.performance || []
        );

      } catch (e) {
        console.error(e);

        setError(
          e.response?.data?.message ||
          e.message ||
          "Could not load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="hero">
        <div>
          <span className="tag">
            STUDENT DASHBOARD
          </span>

          <h2>
            Hello, {user?.name || "Student"} 👋
          </h2>

          <p>
            Find a quiz, test your knowledge
            and track your results.
          </p>
        </div>

        <Link
          className="primary"
          to="/student/quizzes"
        >
          Browse Quizzes
        </Link>
      </section>

      <Alert message={error} />

      {/* Statistics */}
      <section className="stats-grid">

        <div className="stat-card">
          <span>Quizzes Attempted</span>
          <strong>
            {stats?.total_quizzes_attempted ?? 0}
          </strong>
        </div>

        <div className="stat-card">
          <span>Passed</span>
          <strong>
            {stats?.total_quizzes_passed ?? 0}
          </strong>
        </div>

        <div className="stat-card">
          <span>Failed</span>
          <strong>
            {stats?.total_quizzes_failed ?? 0}
          </strong>
        </div>

        <div className="stat-card">
          <span>Average Score</span>
          <strong>
            {stats?.average_score ?? 0}%
          </strong>
        </div>

        <div className="stat-card">
          <span>Highest Score</span>
          <strong>
            {stats?.highest_score ?? 0}%
          </strong>
        </div>

        <div className="stat-card">
          <span>Questions Answered</span>
          <strong>
            {stats?.total_questions_answered ?? 0}
          </strong>
        </div>

      </section>

      {/* Performance */}
      <section className="section-head">
        <div>
          <h3>Performance</h3>
          <p>Your quiz scores over time.</p>
        </div>
      </section>

      <div className="quiz-card">
        {performance.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={performance.map((item, index) => ({
                name: `${item.quiz_title} ${index + 1}`,
                score: Number(item.percentage)
              }))}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Score"
                ]}
              />

              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty">
            No performance data available yet.
          </div>
        )}
      </div>

      {/* Quiz History */}
      <section className="section-head">
        <div>
          <h3>Quiz History</h3>
          <p>
            Your previous completed attempts.
          </p>
        </div>
      </section>

      <div className="card-grid">
        {history.length ? (
          history.map((attempt) => (
            <Link
              className="quiz-card"
              to={`/student/result/${attempt.attempt_id}`}
              key={attempt.attempt_id}
            >
              <span className="tag">
                {attempt.passed
                  ? "PASSED"
                  : "FAILED"}
              </span>

              <h3>
                {attempt.quiz_title}
              </h3>

              <p>
                Score:{" "}
                {attempt.percentage}%
              </p>

              <div className="meta">
                <span>
                  Correct:{" "}
                  {attempt.correct_answers}
                </span>

                <span>
                  {new Date(
                    attempt.completed_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty">
            No quiz attempts yet.
          </div>
        )}
      </div>

      {/* Available Quizzes */}
      <section className="section-head">
        <div>
          <h3>Available Quizzes</h3>
          <p>
            Only published quizzes are shown.
          </p>
        </div>

        <Link to="/student/quizzes">
          View all →
        </Link>
      </section>

      <div className="card-grid">
        {list.slice(0, 6).map((q) => (
          <Link
            className="quiz-card"
            to={`/student/quizzes/${q.id}`}
            key={q.id}
          >
            <span className="tag">
              {q.difficulty}
            </span>

            <h3>{q.title}</h3>

            <p>
              {q.description ||
                "Test your knowledge with this quiz."}
            </p>

            <div className="meta">
              <span>
                ⏱ {q.duration} min
              </span>

              <span>
                Pass {q.passing_score}%
              </span>
            </div>
          </Link>
        ))}

        {!list.length && (
          <div className="empty">
            No published quizzes available.
          </div>
        )}
      </div>
    </>
  );
}