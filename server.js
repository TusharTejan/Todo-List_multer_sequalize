const express = require('express');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Database connection
const sequelize = new Sequelize('todo_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Import Todo model
const Todo = require('./models/Todo')(sequelize);

// Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

app.post('/todos', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.filename : null;
  const todo = await Todo.create({ title, description, image });
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.destroy({ where: { id } });
  res.sendStatus(204);
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
