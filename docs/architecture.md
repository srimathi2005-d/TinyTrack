# TinyTrack — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                  CLIENT (Browser)                   │
│   React + Vite + Tailwind CSS                       │
│   Pages: Login, Register, Dashboard, Analytics      │
└────────────────────┬────────────────────────────────┘
                     │  HTTP / REST  (JWT in header)
                     ▼
┌─────────────────────────────────────────────────────┐
│               NODE.JS + EXPRESS                     │
│   server.js  →  routes  →  middleware  →  controllers│
│                                                     │
│  Auth Flow:    authRoutes → authMiddleware           │
│  URL Flow:     urlRoutes  → authMiddleware           │
│  Analytics:    analyticsRoutes → authMiddleware      │
│  Redirect:     /:shortCode (public)                 │
└────────────────────┬────────────────────────────────┘
                     │  Mongoose ODM
                     ▼
┌─────────────────────────────────────────────────────┐
│                  MONGODB ATLAS                      │
│                                                     │
│   users         urls            analytics           │
│   ─────         ────            ─────────           │
│   _id           _id             _id                 │
│   name          userId ──┐      urlId ──┐           │
│   email         origUrl  │      timestamp│           │
│   password      shortCode│      browser  │           │
│                 clicks   │      device   │           │
│                 createdAt│               │           │
│                          └───────────────┘           │
└─────────────────────────────────────────────────────┘
```

## Request Lifecycle — Creating a Short URL

```
1. User fills form in Dashboard.jsx
2. services/api.js sends POST /api/urls with JWT
3. Express router → authMiddleware verifies JWT
4. urlController.createUrl():
   a. Validates originalUrl format
   b. Checks if customAlias is taken (if provided)
   c. Generates 6-char shortCode via utils/generateCode.js
   d. Saves URL document to MongoDB
   e. Returns URL object + shortUrl string
5. Frontend updates state, shows new link in list
```

## Request Lifecycle — Redirect + Analytics

```
1. Visitor clicks short URL: GET /abc123
2. Express finds URL by shortCode
3. Records Analytics document (browser, device, timestamp)
4. Increments URL.clicks counter
5. Redirects (302) to originalUrl
```

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT signed with `JWT_SECRET` env variable, expires in 7 days
- All URL routes protected with authMiddleware
- Users can only access/delete their own URLs (userId check)
- Input validated before DB operations

## Deployment

```
Frontend → Vercel (auto deploy on git push)
           VITE_API_URL = https://your-app.onrender.com

Backend  → Render (Node.js web service)
           PORT, MONGO_URI, JWT_SECRET, BASE_URL

Database → MongoDB Atlas (free M0 cluster)
           IP whitelist: 0.0.0.0/0 for Render
```
