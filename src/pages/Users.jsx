import { useEffect, useState } from "react";

function Users() {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/users",
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

        setStudents(data.students);
      } catch (error) {
        setMessage("Unable to connect to server");
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Student Management</h1>

      {message && <p>{message}</p>}

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.role}</td>
                <td>{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;