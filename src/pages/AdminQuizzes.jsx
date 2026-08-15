import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { quizzes } from "../api";
import Alert from "../components/Alert";

const empty = { title:"", description:"", category_id:"", difficulty:"EASY", duration:20, passing_score:50, max_attempts:2, status:"DRAFT" };

export default function AdminQuizzes() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    const r = await quizzes.all();
    setList(r.data.quizzes || r.data || []);
  }
  useEffect(() => { load().catch(e => setMessage(e.response?.data?.message || "Could not load quizzes")); }, []);

  async function save(e) {
    e.preventDefault();
    try {
      if (editing) await quizzes.update(editing, form);
      else await quizzes.create(form);
      setForm(empty); setEditing(null); setMessage("Saved successfully."); load();
    } catch (e) { setMessage(e.response?.data?.message || "Save failed"); }
  }

  async function remove(id) {
    if (!confirm("Delete this quiz?")) return;
    try { await quizzes.delete(id); load(); } catch (e) { setMessage(e.response?.data?.message || "Delete failed"); }
  }

  async function publish(q) {
    const next = q.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try { await quizzes.status(q.id, next); load(); } catch (e) { setMessage(e.response?.data?.message || "Status update failed"); }
  }

  return (
    <>
      <div className="page-title"><div><span className="tag">ADMIN</span><h2>Quiz Management</h2></div></div>
      <Alert message={message} type="success" />
      <div className="two-col">
        <form className="panel form-panel" onSubmit={save}>
          <h3>{editing ? "Edit Quiz" : "Create Quiz"}</h3>
          <label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
          <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
          <div className="form-row">
            <label>Difficulty<select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>EASY</option><option>MEDIUM</option><option>HARD</option></select></label>
            <label>Duration (min)<input type="number" min="1" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})}/></label>
          </div>
          <div className="form-row">
            <label>Passing %<input type="number" min="0" max="100" value={form.passing_score} onChange={e=>setForm({...form,passing_score:Number(e.target.value)})}/></label>
            <label>Max attempts<input type="number" min="1" value={form.max_attempts} onChange={e=>setForm({...form,max_attempts:Number(e.target.value)})}/></label>
          </div>
          <div className="button-row"><button className="primary">{editing ? "Update" : "Create"}</button>{editing && <button type="button" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}</div>
        </form>

        <div className="panel">
          <h3>Existing Quizzes</h3>
          <div className="table-wrap"><table><thead><tr><th>Quiz</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {list.map(q => <tr key={q.id}><td><b>{q.title}</b><small>{q.description}</small></td><td>{q.difficulty}</td><td><span className="status">{q.status}</span></td><td className="actions"><Link to={`/admin/questions/${q.id}`}>Questions</Link><button onClick={()=>{setEditing(q.id);setForm({...empty,...q})}}>Edit</button><button onClick={()=>publish(q)}>{q.status==="PUBLISHED"?"Unpublish":"Publish"}</button><button onClick={()=>remove(q.id)}>Delete</button></td></tr>)}
          </tbody></table></div>
        </div>
      </div>
    </>
  );
}