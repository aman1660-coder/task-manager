import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
  const saved = localStorage.getItem("tasks");

  if (saved) {
    setTasks(JSON.parse(saved));
  } else {
    fetchTasks();
  }
}, []);
useEffect(() => {
  if (tasks.length > 0) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}, [tasks]);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await axios.post(API, { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const toggleTask = async (id) => {
    await axios.patch(`${API}/${id}`);
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    await axios.patch(`${API}/edit/${id}`, { title: editText });
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, title: editText } : t
      )
    );
    setEditingId(null);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="container">
      <h2>🚀 Task Manager</h2>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filter-btns">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {filteredTasks.map((task) => (
        <div key={task.id} className="task">
          {editingId === task.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={() => saveEdit(task.id)}>Save</button>
            </>
          ) : (
            <>
              <span
                className={task.completed ? "completed" : ""}
                onClick={() => toggleTask(task.id)}
              >
                {task.title}
              </span>

              <div>
                <button onClick={() => startEdit(task)}>✏️</button>
                <button onClick={() => deleteTask(task.id)}>❌</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;