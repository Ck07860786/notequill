# NoteQuill ✨

NoteQuill is a modern, full-stack note-taking application with OTP and Google authentication, a clean dashboard, and cloud-powered data storage using MongoDB. Built with the MERN stack + Firebase Auth.

---

## 📁 Project Structure

```
client/     # React + Tailwind frontend
server/     # Node.js + Express + MongoDB backend
```

---

## 🚀 Features

- 🔐 Sign up/login with **Google** or **OTP**
- ✍️ Create, view, and delete notes
- 🎨 Modern UI with Tailwind CSS
- 📦 Backend API built with Express and MongoDB
- ☁️ Firebase Authentication
- 🔐 Secure OTP flow via email

---

## 🔧 Prerequisites

Make sure you have these installed:

- **Node.js** (v16 or above)
- **npm** or **yarn**
- **MongoDB Atlas** (or local MongoDB)
- **Firebase Project** with Authentication enabled

---

## 🧠 Environment Variables

### 🛠️ Server (`server/.env`)

```
PORT=8080
MONGO_URI=your_mongodb_connection_string
```

### 🔐 Firebase (`client/firebase.ts`)

Update the Firebase config with your credentials:

```ts
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
};
```

---

## 🛠️ Installation

### 📦 Backend Setup

```bash
cd server
npm install
# or yarn
npm run dev
```

Server will start on: `http://localhost:8080`

### 💻 Frontend Setup

```bash
cd client
npm install
# or yarn
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🧪 API Endpoints

| Method | Route                   | Description             |
|--------|--------------------------|-------------------------|
| POST   | `/api/send-otp`         | Send OTP to email       |
| POST   | `/api/verify-otp`       | Verify OTP              |
| GET    | `/api/notes?email=...`  | Get all notes for email |
| POST   | `/api/notes`            | Create a new note       |
| DELETE | `/api/notes/:id`        | Delete a note by ID     |

---

## 🔐 Authentication Flow

1. **Google Auth** using Firebase
2. **OTP Login** (custom backend OTP generator)
3. Store `email`, `name`, and `photoURL` in `localStorage`
4. Use this info across the session to fetch and save notes

---

## 🖼️ UI Technologies

- ⚛️ React with TypeScript
- 💨 Tailwind CSS
- 🍞 React Toastify for alerts
- 🔒 Firebase Auth
- 📄 Lucide Icons for modern icons

---
