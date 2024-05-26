<template>
  <div class="todo-container">
    <h1>Todo List</h1>
    <form @submit.prevent="addTodo" class="todo-form">
      <div class="form-group">
        <input type="text" v-model="title" placeholder="Title" required />
      </div>
      <div class="form-group">
        <input type="text" v-model="description" placeholder="Description" />
      </div>
      <div class="form-group">
        <input type="file" @change="onFileChange" />
      </div>
      <div class="form-group">
        <button type="submit">Add Todo</button>
      </div>
    </form>

    <ul v-if="todos.length > 0" class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <div class="todo-content">
          <h2>{{ todo.title }}</h2>
          <p>{{ todo.description }}</p>
          <img v-if="todo.image" :src="'http://localhost:3000/uploads/' + todo.image" alt="Todo image" />
        </div>
        <div class="todo-actions">
          <button @click="deleteTodo(todo.id)">Delete</button>
        </div>
      </li>
    </ul>
    <p v-else>No todos available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      todos: [],
      title: '',
      description: '',
      image: null
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('http://localhost:3000/todos');
        this.todos = response.data;
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    },
    onFileChange(event) {
      this.image = event.target.files[0];
    },
    async addTodo() {
      try {
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('description', this.description);
        if (this.image) {
          formData.append('image', this.image);
        }

        await axios.post('http://localhost:3000/todos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        await this.fetchTodos();  // Fetch the updated todo list

        this.title = '';
        this.description = '';
        this.image = null;
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    },
    async deleteTodo(todoId) {
      try {
        await axios.delete(`http://localhost:3000/todos/${todoId}`);
        await this.fetchTodos();  // Fetch the updated todo list
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  }
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

.todo-container {
  
 
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 20px;
}

.todo-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-group {
  flex: 1 1 45%;
  margin-bottom: 10px;
}

input[type="text"],
input[type="file"] {
  width: 94%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button[type="submit"] {
  flex: 1 1 100%;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.todo-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.todo-content {
  flex: 1;
  text-align: left;
}

.todo-content h2 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  color: #333;
}

.todo-content p {
  margin: 0 0 10px 0;
  color: #666;
}

.todo-content img {
  max-width: 100px;
  border-radius: 4px;
  margin-top: 10px;
}

.todo-actions {
  text-align: right;
}

.todo-actions button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.todo-actions button:hover {
  background-color: #c82333;
}

p {
  color: #666;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .todo-form {
    flex-direction: column;
  }

  .form-group {
    flex: 1 1 100%;
  }

  button[type="submit"] {
    margin-top: 10px;
  }

  .todo-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .todo-content img {
    max-width: 100%;
  }

  .todo-actions {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
}
</style>
