import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { quizzes } from "../api";
import Alert from "../components/Alert";

const initial = {
  question_text:"",
  marks:1,
  explanation:"",
  difficulty:"EASY",
  options:[
    {option_text:"",is_correct:false},
    {option_text:"",is_correct:false},
    {option_text:"",is_correct:false},
    {option_text:"",is_correct:false}
  ]
};

export default function AdminQuestions(){
  const {quizId}=useParams();
  const [quiz,setQuiz]=useState(null);
  const [questions,setQuestions]=useState([]);
  const [form,setForm]=useState(initial);
  const [message,setMessage]=useState("");

  async function load(){
    const [q,qs]=await Promise.all([quizzes.details(quizId),quizzes.questions(quizId)]);
    setQuiz(q.data.quiz);
    setQuestions(qs.data.questions || qs.data || []);
  }
  useEffect(()=>{load().catch(e=>setMessage(e.response?.data?.message||"Could not load questions"))},[quizId]);

  function setOption(i,key,value){
    const options=form.options.map((o,idx)=>idx===i?{...o,[key]:value}:key==="is_correct"?{...o,is_correct:false}:o);
    setForm({...form,options});
  }

  async function save(e){
    e.preventDefault();
    try{
      await quizzes.addQuestion(quizId,form);
      setForm(initial);
      setMessage("Question added.");
      load();
    }catch(e){setMessage(e.response?.data?.message||"Could not add question")}
  }

  return <>
    <div className="page-title"><div><span className="tag">ADMIN</span><h2>Questions</h2><p>{quiz?.title || "Quiz"}</p></div><Link to="/admin/quizzes">← Back to quizzes</Link></div>
    <Alert message={message} type="success"/>
    <div className="two-col">
      <form className="panel form-panel" onSubmit={save}>
        <h3>Add Question</h3>
        <label>Question<textarea required value={form.question_text} onChange={e=>setForm({...form,question_text:e.target.value})}/></label>
        <div className="form-row"><label>Marks<input type="number" min="1" value={form.marks} onChange={e=>setForm({...form,marks:Number(e.target.value)})}/></label><label>Difficulty<select value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})}><option>EASY</option><option>MEDIUM</option><option>HARD</option></select></label></div>
        <label>Explanation<textarea value={form.explanation} onChange={e=>setForm({...form,explanation:e.target.value})}/></label>
        <h4>Options (select one correct answer)</h4>
        {form.options.map((o,i)=><div className="option-edit" key={i}><input required placeholder={`Option ${i+1}`} value={o.option_text} onChange={e=>setOption(i,"option_text",e.target.value)}/><label className="check"><input type="radio" name="correct" checked={o.is_correct} onChange={()=>setOption(i,"is_correct",true)}/> Correct</label></div>)}
        <button className="primary">Add Question</button>
      </form>
      <div className="panel"><h3>Existing Questions</h3>{questions.map((q,i)=><div className="question-list" key={q.id}><b>Q{i+1}. {q.question_text}</b><small>{q.difficulty} · {q.marks} mark(s)</small></div>)}{!questions.length&&<div className="empty">No questions yet.</div>}</div>
    </div>
  </>;
}