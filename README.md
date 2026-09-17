# Expense Tracker

A full-stack CRUD app for tracking personal expenses.

**Stack:** React (Vite) frontend, Node.js + Express backend, MongoDB (Mongoose).

```
expense-tracker/
├── backend/     Express API + MongoDB
└── frontend/    React (Vite) UI
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - MongoDB installed locally (`mongod` running on `127.0.0.1:27017`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (get a connection string)

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set `MONGO_URI` to your database (local or Atlas). Leave `PORT=5000` unless it's taken.

Run it:

```bash
npm run dev
```

You should see:
```
MongoDB connected: <your host>
Server running on http://localhost:5000
```

Visit `http://localhost:5000` in a browser — you should get a JSON response confirming the API is running.

## 2. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Both servers need to stay running at the same time — backend on 5000, frontend on 5173.

## 3. Using the app

- Fill in the form on the left to add an expense.
- Use the search box, category dropdown, and date range on the right to filter.
- Click **Edit** to load an expense into the form for editing, or **Delete** (then **Confirm**) to remove it.
- The summary strip at the top updates automatically based on whatever is currently shown in the list.

## API reference

Base URL: `http://localhost:5000/api/expenses`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List expenses. Supports `?category=`, `?search=`, `?from=&to=` |
| GET | `/:id` | Get one expense |
| POST | `/` | Create an expense |
| PUT | `/:id` | Update an expense |
| DELETE | `/:id` | Delete an expense |

All responses use the shape `{ success, message, data }`.

## Common issues

- **"MongoDB connection error"** — MongoDB isn't running locally, or your Atlas connection string/IP allowlist is wrong.
- **CORS error in the browser console** — make sure `CLIENT_ORIGIN` in `backend/.env` matches the URL your frontend is actually running on.
- **Frontend shows "Failed to load expenses"** — the backend isn't running, or `VITE_API_BASE_URL` in `frontend/.env` doesn't match the backend's port.
