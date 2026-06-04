# TinyTrack 🔗

“This project is a part of a hackathon run by https://katomaran.com ”

> A full-stack URL shortening platform with click analytics, user authentication, and performance insights.

![Status](https://img.shields.io/badge/Status-Completed-brightgreen)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB-blue)
![Auth](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📌 Overview

**TinyTrack** allows authenticated users to generate short URLs, track click analytics, manage links through a dashboard, and view performance insights — all in one place.

---

## 🏗️ System Architecture

```
React Frontend
      │
      ▼
  REST APIs
      │
      ▼
Node.js + Express
      │
      ▼
   MongoDB
      │
      ▼
Analytics Collection
```

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- Password Hashing (bcrypt)
- JWT Token Authentication
- Protected Routes via Middleware

### 🔗 URL Shortening
- Generate Short URLs
- Unique Short Code Generation
- Redirect Handling
- URL Validation

### 📊 Dashboard
- View All Links
- Delete Links
- Copy Short URL
- Search Links

### 📈 Analytics
- Click Count Tracking
- Last Visited Timestamp
- Recent Visit Logs
- Device & Browser Information

### 🎁 Bonus Features
- QR Code Generation
- Custom Alias Support
- Daily Click Chart

---

## 🗂️ Project Phases

| Phase | Name | Status |
|-------|------|--------|
| Phase 1 | Planning & System Design | ✅ Completed |
| Phase 2 | Authentication Module | ✅ Completed |
| Phase 3 | URL Shortening Engine | ✅ Completed |
| Phase 4 | Dashboard Development | ✅ Completed |
| Phase 5 | Analytics Tracking | ✅ Completed |
| Phase 6 | Deployment & Documentation | ✅ Completed |

---

## 🗄️ Database Design

### Users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password": "hashed string"
}
```

### URLs
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "originalUrl": "string",
  "shortCode": "string",
  "clicks": "number",
  "createdAt": "Date"
}
```

### Analytics
```json
{
  "_id": "ObjectId",
  "urlId": "ObjectId (ref: URLs)",
  "timestamp": "Date",
  "browser": "string",
  "device": "string"
}
```

---

## 📁 Folder Structure

```
tinytrack/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── context/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── config/
│
├── docs/
│   ├── architecture.png
│   ├── api-docs.md
│   └── planning.md
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:5000
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

---

## 📬 API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT | ❌ |
| POST | `/api/urls` | Create short URL | ✅ |
| GET | `/api/urls` | Get all user URLs | ✅ |
| DELETE | `/api/urls/:id` | Delete a URL | ✅ |
| GET | `/:shortCode` | Redirect to original URL | ❌ |
| GET | `/api/analytics/:urlId` | Get URL analytics | ✅ |

> Full API documentation: [`docs/api-docs.md`](./docs/api-docs.md)

---

## 🗓️ 2-Day Execution Plan

### Day 1 — Backend (8–10 hrs)

| Time | Task |
|------|------|
| Morning (2 hrs) | Express setup, MongoDB, JWT, User & URL models |
| Afternoon (2 hrs) | Signup, Login, Auth middleware |
| Evening (3 hrs) | Short code generation, redirect route, URL validation |
| Night (1 hr) | API testing with Postman |

### Day 2 — Frontend + Deployment (8–10 hrs)

| Time | Task |
|------|------|
| Morning (3 hrs) | Login page, Register page, Dashboard UI |
| Afternoon (2 hrs) | Click count, visit history, analytics page |
| Evening (1.5 hrs) | QR Code & Custom Alias features |
| Night (2 hrs) | Deploy frontend (Vercel) + backend (Render) + database (Atlas) |

---

## 📽️ Demo

https://drive.google.com/file/d/1Bv3xc-Z2DEhfjuzjkLVxmqYMiDlQTuTM/view?usp=drive_link
---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">Built with ❤️ using React, Node.js, Express & MongoDB</p>
