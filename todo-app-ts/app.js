"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
const db = new sqlite3_1.default.Database('todos.db'); // Create a database instance
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);
    yield db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      task TEXT,
      completed INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
    // Create a user
    app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const name = req.body.name;
        const result = yield new Promise((resolve, reject) => {
            db.run('INSERT INTO users (name) VALUES (?)', name, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this);
            });
        });
        res.json({ id: result.lastID });
    }));
    // Get all users
    app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield new Promise((resolve, reject) => {
            db.all('SELECT * FROM users', (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        res.json(users);
    }));
    // Update a user by ID
    app.put('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const name = req.body.name;
        yield new Promise((resolve, reject) => {
            db.run('UPDATE users SET name = ? WHERE id = ?', name, id, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        res.json({ message: 'User updated successfully' });
    }));
    // Delete a user by ID
    app.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        yield new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', id, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        res.json({ message: 'User deleted successfully' });
    }));
    // Create a task for a user
    app.post('/users/:userId/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const { task, completed } = req.body;
        const result = yield new Promise((resolve, reject) => {
            db.run('INSERT INTO tasks (userId, task, completed) VALUES (?, ?, ?)', userId, task, completed, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this);
            });
        });
        res.json({ id: result.lastID });
    }));
    // Get all tasks for a user
    app.get('/users/:userId/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const tasks = yield new Promise((resolve, reject) => {
            db.all('SELECT * FROM tasks WHERE userId = ?', userId, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
        res.json(tasks);
    }));
    // Update a task for a user
    app.put('/users/:userId/tasks/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const taskId = req.params.taskId;
        const { task, completed } = req.body;
        yield new Promise((resolve, reject) => {
            db.run('UPDATE tasks SET task = ?, completed = ? WHERE id = ? AND userId = ?', task, completed, taskId, userId, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        res.json({ message: 'Task updated successfully' });
    }));
    // Delete a task for a user
    app.delete('/users/:userId/tasks/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const taskId = req.params.taskId;
        yield new Promise((resolve, reject) => {
            db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', taskId, userId, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        res.json({ message: 'Task deleted successfully' });
    }));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}))();
