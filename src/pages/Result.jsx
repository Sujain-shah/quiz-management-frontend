import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { attempts } from "../api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function Result() {
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [details, setDetails] = useState([]);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        // Result ko independently load karo
        const response = await attempts.result(attemptId);

        setResult(response.data.result);
      } catch (e) {
        console.error("Result API error:", e);

        setError(
          e.response?.data?.message ||
            "Could not load result"
        );
      }

      // Detailed result separately load karo
      try {
        const response =
          await attempts.detailedResult(attemptId);

        setDetails(response.data.questions || []);
      } catch (e) {
        console.error("Detailed Result API error:", e);

        setDetailsError(
          e.response?.data?.message ||
            "Could not load answer review"
        );
      }
    }

    loadResult();
  }, [attemptId]);

  if (!result && !error) {
    return <Loading />;
  }

  return (
    <>
      <div className="result-hero">
        <span className="tag">QUIZ RESULT</span>

        <h2>
          {result?.quiz_title || "Result"}
        </h2>

        <div
          className={`result-status ${
            result?.passed ? "pass" : "fail"
          }`}
        >
          {result?.passed ? "PASSED" : "FAILED"}
        </div>

        <div className="score">
          {result?.percentage ?? 0}%
        </div>

        <p>
          Passing score:{" "}
          {result?.passing_score ?? 0}%
        </p>
      </div>

      {error && <Alert message={error} />}

      {result && (
        <div className="stats-grid">
          <div className="stat-card">
            <span>Correct</span>
            <strong>
              {result.correct_answers ?? 0}
            </strong>
          </div>

          <div className="stat-card">
            <span>Incorrect</span>
            <strong>
              {result.incorrect_answers ?? 0}
            </strong>
          </div>

          <div className="stat-card">
            <span>Unanswered</span>
            <strong>
              {result.unanswered ?? 0}
            </strong>
          </div>

          <div className="stat-card">
            <span>Time Taken</span>
            <strong>
              {result.time_taken ?? 0}s
            </strong>
          </div>
        </div>
      )}

      <section className="section-head">
        <div>
          <h3>Answer Review</h3>
          <p>
            Review your answers and explanations.
          </p>
        </div>
      </section>

      {detailsError && (
        <Alert message={detailsError} />
      )}

      <div className="review-list">
        {details.map((q, i) => (
          <div
            className="review-card"
            key={q.question_id}
          >
            <div className="review-top">
              <strong>
                Q{i + 1}. {q.question_text}
              </strong>

              <span
                className={
                  q.is_correct
                    ? "correct"
                    : "incorrect"
                }
              >
                {q.is_correct
                  ? "Correct"
                  : "Incorrect"}
              </span>
            </div>

            <p>
              <b>Your answer:</b>{" "}
              {q.selected_answer ||
                "Not answered"}
            </p>

            <p>
              <b>Correct answer:</b>{" "}
              {q.correct_answer || "—"}
            </p>

            {q.explanation && (
              <p className="explanation">
                <b>Explanation:</b>{" "}
                {q.explanation}
              </p>
            )}
          </div>
        ))}

        {!details.length && !detailsError && (
          <div className="empty">
            No question review is available
            for this attempt.
          </div>
        )}
      </div>

      <div className="center-actions">
        <Link
          className="primary"
          to="/student/quizzes"
        >
          Retake / Browse Quizzes
        </Link>
      </div>
    </>
  );
}