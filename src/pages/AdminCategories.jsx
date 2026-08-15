import { useEffect, useState } from "react";
import { categories } from "../api";
import Alert from "../components/Alert";

export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({name:"",description:""});
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  async function load(){ const r=await categories.all(); setList(r.data.categories || r.data || []); }
  useEffect(()=>{load().catch(e=>setMessage(e.response?.data?.message || "Could not load categories"));},[]);

  async function save(e){
    e.preventDefault();
    try {
      if(editing) await categories.update(editing, form); else await categories.create(form);
      setForm({name:"",description:""}); setEditing(null); setMessage("Saved."); load();
    } catch(e){setMessage(e.response?.data?.message || "Save failed");}
  }

  async function remove(id){ if(!confirm("Delete category?"))return; try{await categories.delete(id);load()}catch(e){setMessage(e.response?.data?.message||"Delete failed")} }

  return <>
    <div className="page-title"><div><span className="tag">ADMIN</span><h2>Categories</h2><p>Create and manage quiz categories.</p></div></div>
    <Alert message={message} type="success"/>
    <div className="two-col">
      <form className="panel form-panel" onSubmit={save}>
        <h3>{editing?"Edit Category":"Add Category"}</h3>
        <label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
        <button className="primary">{editing?"Update":"Create"}</button>
      </form>
      <div className="panel"><h3>Categories</h3><div className="list">
        {list.map(c=><div className="list-row" key={c.id}><div><b>{c.name}</b><small>{c.description}</small></div><div className="actions"><button onClick={()=>{setEditing(c.id);setForm({name:c.name,description:c.description||""})}}>Edit</button><button onClick={()=>remove(c.id)}>Delete</button></div></div>)}
        {!list.length&&<div className="empty">No categories yet.</div>}
      </div></div>
    </div>
  </>;
}