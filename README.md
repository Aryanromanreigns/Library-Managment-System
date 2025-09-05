# 📚 Library Management System (MERN)

## Motivation
Libraries are vital resources for education and research, but managing books, users, and borrowing records manually can be inefficient.  
A **digital Library Management System** ensures faster access to books, reduces errors in record-keeping, and improves user experience.  

This project aims to build a **full-stack MERN-based library system** that enables administrators and users to interact seamlessly in a digital environment.

---

## Project Goals
- Implement **user authentication** (Admin & Member roles)  
- Allow admins to **add, edit, delete, and manage books**  
- Provide users with the ability to **search, filter, and view books**  
- Create a **borrow & return system** to track issued books  
- Build a **clean and responsive frontend** for better user experience  
- Ensure **RESTful communication** between backend and frontend  

---

## Project Approach
This project follows a modular MERN architecture:  

- **Frontend (React.js)** → User interface with React Router for navigation, Axios for API calls  
- **Backend (Node.js + Express.js)** → REST APIs for authentication, book management, and borrowing system  
- **Database (MongoDB + Mongoose)** → Schema-driven book, user, and transaction data storage  
- **Authentication** → JWT-based secure login/register system  
- **Error Handling & Middleware** → Centralized error management with reusable middlewares  

---

## Dataset
Unlike ML projects, this system doesn’t rely on a dataset. Instead, data is stored and managed in **MongoDB**:  
- **Users Collection** → stores member & admin details  
- **Books Collection** → stores book information (title, author, description, category, price, availability)  
- **Borrow Records Collection** → tracks borrowed & returned books  

---

## Technologies Used
- **Frontend** → React.js, Axios, React Router DOM, CSS  
- **Backend** → Node.js, Express.js  
- **Database** → MongoDB (Mongoose ODM)  
- **Authentication** → JWT (JSON Web Token)  
- **Development Tools** → Nodemon, Concurrently, VS Code, Postman  

---

## Project Outcome
By the end of this project, we achieve:  
✅ A functional **MERN-based Library Management System**  
✅ Secure **JWT authentication & role-based access**  
✅ **CRUD operations** for managing books  
✅ **Search & filter** functionality for users  
✅ Borrow & return system with proper records  
✅ A responsive **React frontend** integrated with a Node.js backend  
✅ Complete documentation & modular codebase for contributors  

---

## Run Locally

### Prerequisites
- Node.js & npm  
- MongoDB (local or Atlas cloud instance)  

### Steps
```bash
# Clone repository
git clone https://github.com/your-username/library-management-system.git
cd library-management-system

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Setup environment variables inside /server/.env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
PORT=5000

# Run backend
cd server
npm run dev

# Run frontend
cd ../client
npm start
