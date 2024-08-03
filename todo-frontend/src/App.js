import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(response => setTasks(response.data));
  }, []);

  const addTask = () => {
    axios.post('http://localhost:3001/tasks', newTask)
      .then(response => setTasks([...tasks, response.data]));
    setNewTask({ title: '', description: '' });
  };

  const updateTask = () => {
    axios.put(`http://localhost:3001/tasks/${editTaskId}`, editTask)
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task._id === editTaskId ? response.data : task
        );
        setTasks(updatedTasks);
        setEditTaskId(null);
        setEditTask({ title: '', description: '' });
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:3001/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      });
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            {editTaskId === task._id ? (
              <div className="edit-group">
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                />
                <input
                  type="text"
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                />
                <button onClick={updateTask}>Save</button>
                <button onClick={() => setEditTaskId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="task-content">
                <span className="task-title">{task.title}</span>
                <span className="task-description">{task.description}</span>
                <div className="task-actions">
                  <button onClick={() => {
                    setEditTaskId(task._id);
                    setEditTask({ title: task.title, description: task.description });
                  }}>Edit</button>
                  <button className="delete-button" onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
