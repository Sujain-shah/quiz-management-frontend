import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api";
import Alert from "../components/Alert";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await auth.register(form);
      setSuccess("Registration successful. You can login now.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand big">Quiz<span>Flow</span></div>
        <p className="muted">Create your student account</p>
        <h2>Register</h2>
        <Alert message={error} />
        <Alert message={success} type="success" />
        <form onSubmit={submit}>
          <label>Name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></label>
          <label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label>
          <label>Password<input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></label>
          <button className="primary full">Create Account</button>
        </form>
        <p className="auth-link">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}