import React, { useEffect, useState } from "react";
import "./ToDoComponent.scss";

const STORAGE_KEY = "todo-app:list";

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const ToDoComponent = () => {
  const [todoList, setTodoList] = useState(readFromStorage);
  const [todo, setTodo] = useState({ id: "", title: "", checked: false });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
    } catch (e) {
      console.warn("Failed to save todos to localStorage:", e);
    }
  }, [todoList]);

  const handleChange = (e) => {
    setTodo((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = todo.title.trim();
    if (!title) return;

    const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newItem = { ...todo, id: newId };

    setTodoList((prev) => [...prev, newItem]);
    setTodo({ id: "", title: "", checked: false });
  };

  const handleDelete = (id) => {
    setTodoList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleComplete = (id) => {
    setTodoList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const [searchValue, setSearchValue] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  useEffect(() => {
    const newList = todoList.filter((item) => {
      return item.title.indexOf(searchValue) !== -1;
    });
    setFilteredList(newList);
  }, [searchValue, todoList]);

  return (
    <div className="inner">
      <h1 className="title">簡易ToDo管理アプリ</h1>
      <div className="form_area">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="todo" className="input-label">
              内容
            </label>
            <input
              type="text"
              name="todo"
              id="todo"
              placeholder="内容"
              className="input-text"
              onChange={handleChange}
              value={todo.title}
            />
          </div>
          <input
            type="submit"
            value="送信する"
            className="submit"
            disabled={!todo.title.trim()}
          />
        </form>
        <input
          type="text"
          placeholder="検索ワード"
          className="input-text filtered-input-text"
          value={searchValue}
          onChange={handleSearchValueChange}
        />
      </div>

      <div className="todo_container">
        <ul className="todo_list">
          {!searchValue
            ? todoList.map((item) => (
                <li
                  key={item.id}
                  className={item.checked ? "todo_item completed" : "todo_item"}
                >
                  <input
                    type="checkbox"
                    onChange={() => handleComplete(item.id)}
                    checked={item.checked}
                  />
                  <span>{item.title}</span>
                  <button
                    type="button"
                    className="complete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    削除
                  </button>
                </li>
              ))
            : null}
          {searchValue
            ? filteredList.map((item) => (
                <li
                  key={item.id}
                  className={item.checked ? "todo_item completed" : "todo_item"}
                >
                  <input
                    type="checkbox"
                    onChange={() => handleComplete(item.id)}
                    checked={item.checked}
                  />
                  <span>{item.title}</span>
                  <button
                    type="button"
                    className="complete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    削除
                  </button>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default ToDoComponent;
