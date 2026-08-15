import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { attempts, quizzes } from "../api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    quizzes.details(id)
      .then(r => setQuiz(r.data.quiz))
      .catch(e => setError(e.response?.data?.message || "Quiz not found"));
  }, [id]);

  async function start() {
    setStarting(true);
    setError("");
    try {
      const { data } = await attempts.start(id);
      navigate(`/student/quiz/${id}/attempt/${data.attempt.id}`);
    } catch (e) {
      setError(e.response?.data?.message || "Could not start quiz");
    } finally {
      setStarting(false);
    }
  }

  if (!quiz && !error) return <Loading />;

  return (
    <div className="detail-wrap">
      <Alert message={error} />
      {quiz && <div className="detail-card">
        <span className="tag">{quiz.difficulty}</span>
        <h2>{quiz.title}</h2>
        <p className="lead">{quiz.description}</p>
        <div className="detail-grid">
          <div><small>Duration</small><strong>{quiz.duration} min</strong></div>
          <div><small>Passing Score</small><strong>{quiz.passing_score}%</strong></div>
          <div><small>Maximum Attempts</small><strong>{quiz.max_attempts}</strong></div>
          <div><small>Status</small><strong>{quiz.status}</strong></div>
        </div>
        <button className="primary large" onClick={start} disabled={starting}>
          {starting ? "Starting..." : "Start Quiz →"}
        </button>
      </div>}
    </div>
  );
}