# TinyTrack — Phase 1 Planning

## Project Overview

TinyTrack is a full-stack URL shortening platform with:
- User authentication (JWT)
- Short URL generation with unique codes
- Click analytics tracking
- User dashboard for link management
- Bonus: QR codes and custom aliases

---

## User Flow

```
Guest                        Authenticated User
  │                                │
  ├── Visit Landing Page           ├── Login / Signup
  ├── See demo / info              ├── Create Short URL
  │                                ├── View Dashboard
  ├── Click Short URL              ├── View Analytics
  │     │                          ├── Delete Link
  │     ▼                          └── Copy / QR Code
  │   Redirect to Original URL
  │   (Analytics recorded)
```

### Detailed Auth Flow

1. User visits `/signup` → fills form → POST `/api/auth/signup`
2. Server hashes password, saves user, returns JWT
3. JWT stored in `localStorage` on frontend
4. Every protected request sends `Authorization: Bearer <token>`
5. Middleware verifies JWT → attaches `req.user` → proceeds

### URL Shortening Flow

1. Authenticated user submits original URL
2. Server validates URL format
3. Server generates unique 6-char alphanumeric code (or uses custom alias)
4. URL document saved to MongoDB
5. Short URL returned: `https://yourdomain.com/<shortCode>`
6. When anyone visits short URL → redirect to original + record analytics

---

## API Plan

| Method | Endpoint                  | Description              | Auth |
|--------|---------------------------|--------------------------|------|
| POST   | /api/auth/signup          | Register user            | No   |
| POST   | /api/auth/login           | Login, receive JWT       | No   |
| POST   | /api/urls                 | Create short URL         | Yes  |
| GET    | /api/urls                 | Get all URLs for user    | Yes  |
| DELETE | /api/urls/:id             | Delete a URL             | Yes  |
| GET    | /api/analytics/:urlId     | Get analytics for URL    | Yes  |
| GET    | /:shortCode               | Redirect + track click   | No   |

---

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)"
}
```

### URLs Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: Users)",
  "originalUrl": "string",
  "shortCode": "string (unique, 6 chars)",
  "customAlias": "string (optional)",
  "clicks": "number (default: 0)",
  "createdAt": "Date"
}
```

### Analytics Collection
```json
{
  "_id": "ObjectId",
  "urlId": "ObjectId (ref: URLs)",
  "timestamp": "Date",
  "browser": "string",
  "device": "string (mobile | desktop | tablet)"
}
```

---

## Tech Stack Decisions

| Layer       | Technology      | Reason                              |
|-------------|-----------------|-------------------------------------|
| Frontend    | React + Vite    | Fast dev server, modern tooling     |
| Styling     | Tailwind CSS    | Utility-first, rapid UI building    |
| Backend     | Node.js+Express | Lightweight, easy REST API setup    |
| Database    | MongoDB Atlas   | Flexible schema, free tier          |
| Auth        | JWT + bcrypt    | Stateless, secure                   |
| Deploy FE   | Vercel          | Free, auto deploys from Git         |
| Deploy BE   | Render          | Free tier, easy Node.js hosting     |

---

## Folder Structure

```
tinytrack/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   └── Analytics.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── UrlCard.jsx
│       │   ├── UrlForm.jsx
│       │   └── QRModal.jsx
│       ├── services/
│       │   └── api.js          ← axios instance + all API calls
│       └── context/
│           └── AuthContext.jsx ← global auth state
│
├── backend/
│   ├── config/
│   │   └── db.js               ← MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Url.js
│   │   └── Analytics.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── urlController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── urlRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js   ← JWT verify
│   ├── utils/
│   │   └── generateCode.js     ← short code generator
│   └── server.js               ← entry point
│
├── docs/
│   ├── planning.md             ← this file
│   ├── api-docs.md
│   └── architecture.md
│
└── README.md
```
