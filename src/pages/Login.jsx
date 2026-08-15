import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api";
import { saveSession, roleOf } from "../auth";
import Alert from "../components/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await auth.login(form);
      const session = saveSession(data);
      const role = roleOf(session.user || data.user);
      navigate(role === "ADMIN" ? "/admin" : "/student", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand big">Quiz<span>Flow</span></div>
        <p className="muted">Online Quiz & Assessment Platform</p>
        <h2>Welcome back</h2>
        <Alert message={error} />
        <form onSubmit={submit}>
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label>
          <label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></label>
          <button className="primary full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}