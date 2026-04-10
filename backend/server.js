const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST create task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH update task
app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter(t => t.id !== req.params.id);
  res.json({ message: "Deleted" });
});
// UPDATE task title
app.patch("/tasks/edit/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ error: "Task not found" });

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title required" });
  }

  task.title = title;
  res.json(task);
});
app.listen(5000, () => console.log("Server running on port 5000"));