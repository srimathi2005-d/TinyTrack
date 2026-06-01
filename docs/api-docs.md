# TinyTrack — API Documentation

Base URL (local): `http://localhost:5000`  
Base URL (prod): `https://your-render-app.onrender.com`

---

## Auth

### POST /api/auth/signup

Register a new user.

**Request Body**
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "secret123"
}
```

**Response 201**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64abc...",
    "name": "Ravi Kumar",
    "email": "ravi@example.com"
  }
}
```

**Errors**
- `400` — missing fields or invalid email
- `409` — email already registered

---

### POST /api/auth/login

Login and receive a JWT.

**Request Body**
```json
{
  "email": "ravi@example.com",
  "password": "secret123"
}
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64abc...",
    "name": "Ravi Kumar",
    "email": "ravi@example.com"
  }
}
```

**Errors**
- `400` — missing fields
- `401` — invalid credentials

---

## URLs

> All URL routes require `Authorization: Bearer <token>` header.

### POST /api/urls

Create a new short URL.

**Request Body**
```json
{
  "originalUrl": "https://www.example.com/very/long/path",
  "customAlias": "mylink"    // optional
}
```

**Response 201**
```json
{
  "_id": "64def...",
  "userId": "64abc...",
  "originalUrl": "https://www.example.com/very/long/path",
  "shortCode": "mylink",
  "clicks": 0,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "shortUrl": "http://localhost:5000/mylink"
}
```

**Errors**
- `400` — invalid URL format
- `409` — alias already taken

---

### GET /api/urls

Get all URLs created by the logged-in user.

**Response 200**
```json
[
  {
    "_id": "64def...",
    "originalUrl": "https://example.com",
    "shortCode": "abc123",
    "clicks": 14,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "shortUrl": "http://localhost:5000/abc123"
  }
]
```

---

### DELETE /api/urls/:id

Delete a URL by its MongoDB `_id`.

**Response 200**
```json
{ "message": "URL deleted successfully" }
```

**Errors**
- `403` — URL belongs to another user
- `404` — URL not found

---

## Redirect

### GET /:shortCode

Redirects to the original URL and records a click.  
No auth required — this is the public redirect endpoint.

**Response** `302 Redirect` → `originalUrl`

**Analytics recorded automatically:**
```json
{
  "urlId": "64def...",
  "timestamp": "2024-01-05T14:22:00.000Z",
  "browser": "Chrome",
  "device": "desktop"
}
```

**Errors**
- `404` — short code not found

---

## Analytics

### GET /api/analytics/:urlId

Get analytics for a specific URL.

**Response 200**
```json
{
  "totalClicks": 42,
  "lastVisited": "2024-01-05T14:22:00.000Z",
  "recentVisits": [
    {
      "timestamp": "2024-01-05T14:22:00.000Z",
      "browser": "Chrome",
      "device": "desktop"
    },
    {
      "timestamp": "2024-01-04T09:10:00.000Z",
      "browser": "Safari",
      "device": "mobile"
    }
  ],
  "dailyClicks": [
    { "date": "2024-01-04", "count": 8 },
    { "date": "2024-01-05", "count": 14 }
  ]
}
```

**Errors**
- `403` — URL belongs to another user
- `404` — URL not found

---

## Error Format

All errors follow this format:

```json
{
  "message": "Human-readable error description"
}
```

---

## Auth Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Store the token in `localStorage` after login and attach it to every protected request.
