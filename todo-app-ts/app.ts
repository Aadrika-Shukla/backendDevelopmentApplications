import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import sqlite3, { RunResult } from 'sqlite3';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

interface User {
  id: number;
  name: string;
}

interface Task {
  id: number;
  userId: number;
  task: string;
  completed: number;
}

const db = new sqlite3.Database('todos.db'); // Create a database instance

(async () => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      task TEXT,
      completed INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Create a user
  app.post('/users', async (req: Request, res: Response) => {
    const name = req.body.name;
    const result = await new Promise<RunResult>((resolve, reject) => {
      db.run('INSERT INTO users (name) VALUES (?)', name, function(this: RunResult, err: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this);
      });
    });
    res.json({ id: result.lastID });
  });

  // Get all users
  app.get('/users', async (req: Request, res: Response) => {
    const users: User[] = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as User[]);
      });
    });
    res.json(users);
  });

  // Update a user by ID
  app.put('/users/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const name = req.body.name;
    await new Promise<void>((resolve, reject) => {
      db.run('UPDATE users SET name = ? WHERE id = ?', name, id, function(this: RunResult, err: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    res.json({ message: 'User updated successfully' });
  });

  // Delete a user by ID
  app.delete('/users/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    await new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', id, function(this: RunResult, err: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    res.json({ message: 'User deleted successfully' });
  });

  // Create a task for a user
  app.post('/users/:userId/tasks', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { task, completed } = req.body;
    const result = await new Promise<RunResult>((resolve, reject) => {
      db.run('INSERT INTO tasks (userId, task, completed) VALUES (?, ?, ?)', userId, task, completed, function(this: RunResult, err: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this);
      });
    });
    res.json({ id: result.lastID });
  });

  // Get all tasks for a user
  app.get('/users/:userId/tasks', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const tasks: Task[] = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE userId = ?', userId, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as Task[]);
      });
    });
    res.json(tasks);
  });

  // Update a task for a user
  app.put('/users/:userId/tasks/:taskId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    const { task, completed } = req.body;
    await new Promise<void>((resolve, reject) => {
      db.run('UPDATE tasks SET task = ?, completed = ? WHERE id = ? AND userId = ?', task, completed, taskId, userId, function(this: RunResult, err: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    res.json({ message: 'Task updated successfully' });
  });

  // Delete a task for a user
  app.delete('/users/:userId/tasks/:taskId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    await new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', taskId, userId, function(this: RunResult, err: Error) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    res.json({ message: 'Task deleted successfully' });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();