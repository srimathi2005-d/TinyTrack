# Google OAuth Setup Guide

## Backend Setup

Google OAuth is now integrated into the backend. The `/api/auth/google` endpoint handles user authentication with Google credentials.

### Endpoint
- **POST** `/api/auth/google`
- **Body**: `{ name: string, email: string }`
- **Response**: `{ token: string, user: { _id: string, name: string, email: string } }`

## Frontend Setup

To enable Google OAuth on the frontend, you need to set up a Google OAuth Client ID.

### Steps:

1. **Create a Google OAuth Client ID**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create an OAuth 2.0 Client ID (Web Application)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for local development)
     - Your production domain (when deployed)

2. **Configure Environment Variable**
   - Copy `.env.example` to `.env`
   - Replace `your_google_client_id_here` with your actual Google Client ID:
     ```
     VITE_GOOGLE_CLIENT_ID=your_actual_client_id
     ```

3. **Restart the Frontend**
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again
   - The environment variable will be loaded

### How It Works

1. User clicks "Continue with Google"
2. Google OAuth popup opens
3. User authenticates with Google
4. Frontend receives Google's ID token
5. Token is decoded to extract user info (name, email)
6. Backend's `/api/auth/google` endpoint is called with user info
7. Backend checks if user exists:
   - If exists: returns JWT token with existing user
   - If new: creates new user and returns JWT token
8. User is logged in and redirected to dashboard

### Testing

1. Click "Continue with Google" on Login or Register page
2. Select or sign in with a Google account
3. You should be authenticated and redirected to the dashboard

### Troubleshooting

- **"YOUR_GOOGLE_CLIENT_ID" message appears**: The .env file hasn't been set up. Add your Client ID to the `.env` file.
- **OAuth popup doesn't appear**: Check that your Google Client ID is correct and that your domain is in the authorized redirect URIs.
- **"Google authentication failed" error**: Check backend logs. The `/api/auth/google` endpoint may not be reachable or there's an issue with the response.
