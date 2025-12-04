import { useEffect, useState, useRef } from "react";
import styles from "../styles/todolist.module.css";

export default function ToDoList() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const inputRef = useRef(null);

  // Load items from localStorage
  const loadItems = () => {
    setLoading(true);
    try {
      const savedItems = localStorage.getItem('todoItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to load items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Save items to localStorage
  const saveItems = (itemsArray) => {
    localStorage.setItem('todoItems', JSON.stringify(itemsArray));
  };

  // Add item
  const addItem = () => {
    if (!text.trim()) return;
    
    setAdding(true);
    try {
      const newItem = {
        id: Date.now().toString(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        completed: false
      };
      
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveItems(updatedItems);
      setText("");
    } catch (error) {
      console.error("Failed to add item:", error);
    } finally {
      setAdding(false);
    }
  };

  // Delete item
  const deleteItem = (id) => {
    setDeletingId(id);
    try {
      setTimeout(() => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        saveItems(updatedItems);
        setDeletingId(null);
      }, 300);
    } catch (error) {
      console.error("Failed to delete item:", error);
      setDeletingId(null);
    }
  };

  // Toggle complete status
  const toggleComplete = (id) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  useEffect(() => {
    loadItems();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>✓</span>
            My To-Do List
            <span className={styles.countBadge}>
              {items.length}
            </span>
          </h1>
          <p className={styles.subtitle}>
            Stay organized and boost your productivity
          </p>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              className={styles.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              disabled={adding}
            />
            <button
              className={`${styles.addButton} ${adding ? styles.adding : ''}`}
              onClick={addItem}
              disabled={adding || !text.trim()}
            >
              {adding ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  <span className={styles.buttonIcon}>+</span>
                  <span className={styles.buttonText}>Add Task</span>
                </>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading your tasks...</p>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3 className={styles.emptyTitle}>No tasks yet</h3>
            <p className={styles.emptyText}>
              Add a task above to get started!
            </p>
          </div>
        ) : (
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li 
                key={item.id} 
                className={`${styles.listItem} ${deletingId === item.id ? styles.deleting : ''} ${item.completed ? styles.completed : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={styles.itemContent}>
                  <button 
                    className={`${styles.checkbox} ${item.completed ? styles.checked : ''}`}
                    onClick={() => toggleComplete(item.id)}
                    aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {item.completed && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                  <span className={styles.itemText}>{item.text}</span>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteItem(item.id)}
                  disabled={deletingId === item.id}
                  aria-label="Delete task"
                >
                  {deletingId === item.id ? (
                    <span className={styles.deleteSpinner}></span>
                  ) : (
                    <span className={styles.deleteIcon}>×</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.stats}>
              <span className={styles.statItem}>
                <strong>{items.length}</strong> total
              </span>
              <span className={styles.statItem}>
                <strong>{items.filter(item => item.completed).length}</strong> completed
              </span>
            </div>
            <div className={styles.hint}>
              Press <kbd>Enter</kbd> to add tasks quickly
            </div>
          </div>
        )}
      </div>
    </div>
  );
}