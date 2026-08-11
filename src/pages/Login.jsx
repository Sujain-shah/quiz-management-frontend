import { useState } from "react";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setMessage(data.message);

            console.log("Login response:", data);

        } catch (error) {
            setMessage("Unable to connect to server");
        }
    };
    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/logout",
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setMessage(data.message);
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setMessage("Logged out");
        }
    };
    return (
        <div>
            <h1>Student Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Login</button>
            </form>


            {message && <p>{message}</p>}
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Login;