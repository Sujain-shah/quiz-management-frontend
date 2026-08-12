import { useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setCurrentPage("users")}>
          Users
        </button>
      </nav>

      {currentPage === "dashboard" && <AdminDashboard />}

      {currentPage === "users" && <Users />}
    </div>
  );
}

export default App;