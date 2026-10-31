# Spendly — Personal Expense Tracker

A full-stack expense tracker built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Project Structure

```
expense-tracker/
├── backend/          ← Node.js + Express API
└── frontend/         ← React + Vite + Tailwind CSS
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Backend Setup

```bash
cd backend

# Copy the example env file and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend runs on **http://localhost:5001**

**`.env` variables:**

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/spendly
JWT_SECRET=your_super_secret_key_change_this
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## Features

- **Landing page** — marketing page with hero, features, and CTA
- **Register** — create an account (name, email, password)
- **Login** — sign in with email and password
- **Dashboard** — view all expenses, add new expenses, delete expenses
- **JWT authentication** — token stored in localStorage, sent in Authorization header
- **Protected routes** — dashboard requires login

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get token |
| GET | `/api/expenses` | Yes | Get all expenses |
| POST | `/api/expenses` | Yes | Create an expense |
| PUT | `/api/expenses/:id` | Yes | Update an expense |
| DELETE | `/api/expenses/:id` | Yes | Delete an expense |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |

