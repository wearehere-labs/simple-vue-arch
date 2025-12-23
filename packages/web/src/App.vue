<template>
  <div class="todo-app">
    <header>
      <h1>📝 Todo App</h1>
    </header>

    <main>
      <div class="todo-form">
        <input
          v-model="newTodo.title"
          @keyup.enter="addTodo"
          type="text"
          placeholder="What needs to be done?"
          class="todo-input"
        />
        <input
          v-model="newTodo.description"
          @keyup.enter="addTodo"
          type="text"
          placeholder="Description (optional)"
          class="todo-input"
        />
        <button @click="addTodo" class="btn btn-primary">Add Todo</button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else class="todo-list">
        <div v-if="todos.length === 0" class="empty-state">
          No todos yet. Add one above!
        </div>
        
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
            class="todo-checkbox"
          />
          <div class="todo-content">
            <h3>{{ todo.title }}</h3>
            <p v-if="todo.description" class="todo-description">
              {{ todo.description }}
            </p>
            <span class="todo-date">
              {{ formatDate(todo.createdAt) }}
            </span>
          </div>
          <button @click="deleteTodo(todo.id)" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { todoApi, Todo, CreateTodoDto } from './api/todoApi';

const todos = ref<Todo[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const newTodo = ref<CreateTodoDto>({
  title: '',
  description: ''
});

async function loadTodos() {
  loading.value = true;
  error.value = null;
  try {
    todos.value = await todoApi.getAll();
  } catch (e) {
    error.value = 'Failed to load todos. Make sure the API server is running.';
    console.error('Error loading todos:', e);
  } finally {
    loading.value = false;
  }
}

async function addTodo() {
  if (!newTodo.value.title.trim()) {
    return;
  }

  try {
    const created = await todoApi.create(newTodo.value);
    todos.value.unshift(created);
    newTodo.value = { title: '', description: '' };
  } catch (e) {
    error.value = 'Failed to add todo';
    console.error('Error adding todo:', e);
  }
}

async function toggleTodo(todo: Todo) {
  try {
    const updated = await todoApi.update(todo.id, {
      completed: !todo.completed
    });
    const index = todos.value.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      todos.value[index] = updated;
    }
  } catch (e) {
    error.value = 'Failed to update todo';
    console.error('Error updating todo:', e);
  }
}

async function deleteTodo(id: string) {
  try {
    await todoApi.delete(id);
    todos.value = todos.value.filter(t => t.id !== id);
  } catch (e) {
    error.value = 'Failed to delete todo';
    console.error('Error deleting todo:', e);
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

onMounted(() => {
  loadTodos();
});
</script>

<style scoped>
.todo-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

.todo-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.todo-input {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.todo-input:focus {
  border-color: #4CAF50;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-danger {
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
}

.btn-danger:hover {
  background-color: #da190b;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

.error {
  color: #f44336;
  background-color: #ffebee;
  border-radius: 8px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s;
}

.todo-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.6;
  background-color: #f5f5f5;
}

.todo-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.todo-content {
  flex: 1;
}

.todo-content h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 18px;
}

.todo-item.completed h3 {
  text-decoration: line-through;
}

.todo-description {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.todo-date {
  font-size: 12px;
  color: #999;
}
</style>
