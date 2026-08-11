import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? <Login /> : <Register />}

      <div>
        {showLogin ? (
          <p>
            Don't have an account?{" "}
            <button onClick={() => setShowLogin(false)}>
              Register
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setShowLogin(true)}>
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;