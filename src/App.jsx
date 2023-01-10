import React, { useEffect, useState, useRef } from 'react';
import Sentiment from 'sentiment';
import 'bootstrap/dist/css/bootstrap.min.css';
import {listen} from '@tauri-apps/api/event'

const sentiment = new Sentiment();

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef()

  function handleChange(event) {
    setInput(event.target.value);
  }

  useEffect(() => {
    listen('new-todo', () => {
      inputRef.current.focus()
    })
  }, [])

  function handleSubmit(event) {
    event.preventDefault();
    const sentimentResult = sentiment.analyze(input);
    const todo = { task: input, sentiment: sentimentResult };
    setTodos([...todos, todo]);
    setInput('');
  }

  function getSentimentString(score) {
    if (score > 0) {
      return 'positive';
    } else if (score < 0) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  return (
    <div className="container mt-5">
      <h1>Sentiment-Do</h1>
      <h4>The to-do app with sentiment analysis</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="todo-input">To-do:</label>
          <input
            type="text"
            className="form-control"
            id="todo-input"
            value={input}
            onChange={handleChange}
            ref={inputRef}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
      <ul className="list-group mt-3">
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              todo.sentiment.score > 0
                ? 'bg-success text-white'
                : todo.sentiment.score < 0
                ? 'bg-danger text-white'
                : ''
            }`}
          >
            {todo.task}
            <span className={`badge badge-pill ${
              todo.sentiment.score === 0 ? 'bg-secondary' : ''
            }`}>
              {getSentimentString(todo.sentiment.score)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;