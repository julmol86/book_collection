# Book Collection Application

This project is a full-stack application for managing a collection of books. It includes a frontend built with React, a backend built with Go, and a PostgreSQL database. The application allows users to view, add, update, and delete books from the collection.

# Table of content

- [Running this App with Docker](#running-this-app-with-docker)
- [Main features](#main-features)
- [Technologies](#technologies)
- [Running this App locally](#running-this-app-locally)
- [Author](#author)

# Running this App with Docker

### Prerequisites

Docker

### Build and Start Services:

1. Clone the Repository

2. Build and Start Services from project folder:

```
docker-compose up -d
```

This will build and start the backend, frontend, database services and run Cypress tests.

### Access the Application:

Once the services are up and running:

Frontend: http://localhost:5173

Backend API: http://localhost:8080/book/list

### Running Inteagration tests inside the backend container

```
docker exec -it books-backend /bin/sh
go test ./tests/
```

### Running Cypress tests in Docker

```
docker-compose run cypress
```

# Main features

Book Management: View, add, update, and delete books.

# Technologies

React: Chosen primarily to meet the requirements of this task

PostgreSQL: I picked PostgreSQL since I'm familiar with it. It's a strong and reliable database system, great for handling complex data in real-world projects.

Cypress: I chose Cypress for testing because I’ve worked with it before. It’s a user-friendly tool for end-to-end testing, which helps make sure the app’s interface works well.

Go: I chose Go as the backend language to explore and gain experience with a new programming language. Go is simple, efficient, and good for building fast, scalable server-side apps.

Docker: Docker was selected due to my familiarity with containerization, as well as the opportunity to containerize the entire application stack independently. Docker makes it easy to keep everything consistent from development to production, and it helps with deploying and scaling the app.

# Running this App locally

### Prerequisites

Docker for DB container

Node.js

Go

### Start app:

If you want to run the frontend or backend locally

DB container should be up and running

### Backend:

```
cd backend
go run main.go
```

### Frontend:

```
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

Backend API: http://localhost:8080/book/list

### Running Integration tests locally

```
cd backend
go test ./tests/
```

### Running Cypress Tests locally

Ensure your application is running on localhost.

Run Cypress:

```
npx cypress open
```

This will open the Cypress Test Runner where you can run your tests interactively.

# Author

Yulia Mozhaeva
