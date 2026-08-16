import { useEffect, useState } from "react";
import { users } from "../api";
import Alert from "../components/Alert";

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const r = await users.all();
    setList(r.data.students || []);
  }
  useEffect(() => { load().catch(e => setMessage(e.response?.data?.message || "Could not load students")) }, []);

  async function toggle(u) {
    const next = String(u.status).toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try { await users.status(u.id, next); load() } catch (e) { setMessage(e.response?.data?.message || "Status update failed") }
  }

  async function remove(id) { if (!confirm("Delete student?")) return; try { await users.delete(id); load() } catch (e) { setMessage(e.response?.data?.message || "Delete failed") } }

  return <>
    <div className="page-title"><div><span className="tag">ADMIN</span><h2>Student Management</h2><p>View and manage registered students.</p></div></div>
    <Alert message={message} />
    <div className="panel table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {list.map(u => <tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.role}</td><td><span className="status">{u.status}</span></td><td className="actions"><button onClick={() => toggle(u)}>{String(u.status).toUpperCase() === "ACTIVE" ? "Deactivate" : "Activate"}</button><button onClick={() => remove(u.id)}>Delete</button></td></tr>)}
    </tbody></table></div>
  </>;
}