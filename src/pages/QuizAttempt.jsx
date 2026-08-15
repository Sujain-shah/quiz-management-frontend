import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { attempts } from "../api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function QuizAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAttempt() {
      try {
        const response = await attempts.get(attemptId);
        const questionsResponse =
          await attempts.questions(attemptId);

        const attempt = response.data.attempt;
        const quiz = response.data.quiz;

        const started = new Date(attempt.started_at).getTime();

        const seconds = Math.max(
          0,
          quiz.duration * 60 -
          Math.floor((Date.now() - started) / 1000)
        );

        setRemaining(seconds);

        /*
          IMPORTANT:
          Do NOT call attempts.start() here.
          The attempt has already been created before
          navigating to this page.
        */

        setData({
          attempt,
          quiz,
          questions: questionsResponse.data.questions || []
        });

      } catch (e) {
        setError(
          e.response?.data?.message ||
          "Could not load attempt"
        );
      }
    }

    loadAttempt();
  }, [attemptId]);

  useEffect(() => {
    if (remaining === null) return;

    if (remaining <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  const question = data?.questions?.[index];
  const total = data?.questions?.length || 0;

  const timeText = useMemo(() => {
    if (remaining === null) {
      return "--:--";
    }

    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (remaining % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [remaining]);

  async function choose(optionId) {
    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionId
    }));

    try {
      await attempts.answer(attemptId, {
        question_id: question.id,
        selected_option_id: optionId
      });
    } catch (e) {
      setError(
        e.response?.data?.message ||
        "Could not save answer"
      );
    }
  }

  async function submitQuiz() {
    if (submitting) return;

    setSubmitting(true);

    try {
      await attempts.submit(attemptId);

      navigate(`/student/result/${attemptId}`, {
        replace: true
      });

    } catch (e) {
      setError(
        e.response?.data?.message ||
        "Could not submit quiz"
      );

      setSubmitting(false);
    }
  }

  if (error && !data) {
    return <Alert message={error} />;
  }

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <div className="attempt-head">
        <div>
          <span className="tag">QUIZ IN PROGRESS</span>

          <h2>{data.quiz.title}</h2>
        </div>

        <div
          className={`timer ${remaining < 60 ? "danger" : ""
            }`}
        >
          Time Remaining

          <strong>{timeText}</strong>
        </div>
      </div>

      <Alert message={error} />

      {!total ? (
        <div className="empty">
          This quiz has no questions yet.
        </div>
      ) : (
        <div className="attempt-layout">

          <aside className="question-nav">
            <strong>Questions</strong>

            <div className="question-numbers">
              {data.questions.map((q, i) => (
                <button
                  key={q.id}
                  className={
                    i === index
                      ? "active"
                      : answers[q.id]
                        ? "answered"
                        : ""
                  }
                  onClick={() => setIndex(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="danger-btn"
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </button>
          </aside>

          <section className="question-card">

            <div className="question-count">
              Question {index + 1} of {total}
            </div>

            <h3>{question.question_text}</h3>

            <div className="options">
              {(question.options || []).map((option) => (
                <button
                  key={option.id}
                  className={`option ${answers[question.id] === option.id
                    ? "selected"
                    : ""
                    }`}
                  onClick={() =>
                    choose(option.id)
                  }
                >
                  <span className="radio">
                    {answers[question.id] === option.id
                      ? "✓"
                      : ""}
                  </span>

                  {option.option_text}
                </button>
              ))}
            </div>

            <div className="nav-buttons">

              <button
                onClick={() =>
                  setIndex((i) => Math.max(0, i - 1))
                }
                disabled={index === 0}
              >
                ← Previous
              </button>

              <button
                className="primary"
                onClick={() =>
                  setIndex((i) =>
                    Math.min(total - 1, i + 1)
                  )
                }
                disabled={index === total - 1}
              >
                Next →
              </button>

            </div>

          </section>

        </div>
      )}
    </>
  );
}