import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, getUser, roleOf } from "../auth";
import { auth } from "../api";

export default function Layout() {
  const navigate = useNavigate();
  const user = getUser();
  const admin = roleOf(user) === "ADMIN";

  async function logout() {
    try { await auth.logout(); } catch { }
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Quiz<span>Flow</span></div>
        <div className="role-pill">{admin ? "ADMIN" : "STUDENT"}</div>

        <nav>
          {admin ? (
            <>
              <NavLink to="/admin">Dashboard</NavLink>
              <NavLink to="/admin/quizzes">Quizzes</NavLink>
              <NavLink to="/admin/categories">Categories</NavLink>
              <NavLink to="/admin/users">Students</NavLink>
              <NavLink to="/admin/analytics">Analytics</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/student">Dashboard</NavLink>
              <NavLink to="/student/quizzes">Browse Quizzes</NavLink>
            </>
          )}
        </nav>

        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Quiz Management & Online Assessment</div>
            <h1>{admin ? "Admin Panel" : "Student Portal"}</h1>
          </div>
          <div className="user-chip">
            <div className="avatar">{(user?.name || "U").slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "User"}</strong>
              <small>{user?.email || ""}</small>
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}