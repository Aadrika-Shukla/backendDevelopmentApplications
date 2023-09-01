TODOLIST APP(Type Script)

This is a backend server for Todolist app. Backend is built with node.js, express.js and SQlite with REST api exposed.
APIs can be used to create, read, update and delete users and their associated tasks. Follow the steps below to set up and run the app.

## Getting Started##

### Pre requisites###

 * Node.js (https://nodejs.org/)
 * npm (Node Package Manager)

### Installation###

1. **Clone the Repository:**

   Clone this repository or download the source code to your local machine.

   ```bash
   git clone <repository_url>

Steps involved:

1.Replace <repository_url> with the URL of this repository.

Navigate to the Project Directory:

Open your terminal and navigate to the project directory.
 using   cd todo-app-ts
 
2.Initialize a New Node.js Project:

Initialize a new Node.js project and follow the prompts to create a package.json file.
using npm init-y

3.Install Dependencies:

Install the required dependencies.

npm install express sqlite3 body-parser typescript @types/express @types/node

4.Initialize TypeScript Configuration file using below command:

#npm tsc --init

5.To compile 'app.ts' to 'app.js':

#npx tsc --outFile app.js app.ts

6.Run the app :

#node app.js

The server will start, and we should see a message indicating that it's running on a specific port like:Server is running on port 3000

7.USING APIs:

 We can use Postman to test APIs. Curl examples are below:

 curl http://localhost:3000/users

 curl -X POST -H "Content-Type: application/json" -d '{"name": "Sanjeev Reddy"}' http://localhost:3000/users

 curl -X PUT -H "Content-Type: application/json" -d '{"name": "Sanjeev Kumar"}' http://localhost:3000/users/1

 curl -X POST -H "Content-Type: application/json" -d '{"task": "Buy groceries", "completed": 0}' http://localhost:3000/users/1/tasks

 curl http://localhost:3000/users/1/tasks

 curl -X PUT -H "Content-Type: application/json" -d '{"completed": 1}' http://localhost:3000/users/1/tasks/1

 curl -X DELETE http://localhost:3000/users/1/tasks/1


8.DATABASE:

The app employs SQLite as its database, with the database file (todos.db) being generated in the project directory. 
Two tables have been created as below.
1. User Table : Id, name
2. Task table: Id, task, completed

The users table manages multiple users, while the tasks table enables users to create, read, update, and delete their individual to-do lists.

RECOMMENDATIONS AND SUGGESTIONS:

1. We should consider creating a frontend.
2. Performing performance testing and stress testing would be beneficial.
3. Enhancing the application with additional features such as due dates and reminders could improve user experience.
4. Developing to-do templates for frequently performed tasks would be good.


LINK FOR POSTMAN COLLECTION DOCUMENTER:

https://drive.google.com/file/d/1E_WaJI2ymHipin2nZUuZ7KBLmGkT99_-/view?usp=drive_link




