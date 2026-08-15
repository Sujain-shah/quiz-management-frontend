import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { quizzes } from "../api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function QuizList() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    quizzes.published()
      .then(r => setList(r.data.quizzes || []))
      .catch(e => setError(e.response?.data?.message || "Could not load quizzes"));
  }, []);

  const filtered = useMemo(() => list.filter(q => {
    const a = q.title?.toLowerCase().includes(search.toLowerCase());
    const b = !difficulty || q.difficulty === difficulty;
    return a && b;
  }), [list, search, difficulty]);

  return (
    <>
      <div className="page-title"><div><span className="tag">STUDENT</span><h2>Browse Quizzes</h2><p>Search and filter available assessments.</p></div></div>
      <Alert message={error} />
      <div className="filters">
        <input placeholder="Search by quiz title..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="">All difficulty</option>
          <option>EASY</option><option>MEDIUM</option><option>HARD</option>
        </select>
      </div>
      {!list.length && !error ? <Loading /> : (
        <div className="card-grid">
          {filtered.map(q => (
            <Link className="quiz-card" to={`/student/quizzes/${q.id}`} key={q.id}>
              <span className="tag">{q.difficulty}</span>
              <h3>{q.title}</h3>
              <p>{q.description || "No description available."}</p>
              <div className="meta"><span>⏱ {q.duration} min</span><span>Attempts {q.max_attempts}</span></div>
            </Link>
          ))}
          {!filtered.length && <div className="empty">No matching quizzes.</div>}
        </div>
      )}
    </>
  );
}