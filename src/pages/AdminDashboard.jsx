import { useEffect, useState } from "react";

function AdminDashboard() {
    const [totalStudents, setTotalStudents] = useState(0);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }

                setTotalStudents(data.totalStudents);
            } catch (error) {
                setMessage("Unable to connect to server");
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {message && <p>{message}</p>}

            <div>
                <h2>Total Students</h2>
                <p>{totalStudents}</p>
            </div>
        </div>
    );
}

export default AdminDashboard;