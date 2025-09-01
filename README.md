# HD Notes - Full-Stack Note-Taking Application

A beautiful, full-stack note-taking application built with React TypeScript frontend and Node.js Express TypeScript backend, featuring OTP-based authentication, Google OAuth, and professional email templates.

## Features Overview

### 🔐 **Authentication System**
- **OTP-Based Authentication**: Email + OTP flow for both signup and signin (no passwords)
- **Google OAuth Integration**: One-click Google sign-in with automatic account creation
- **JWT Authorization**: Secure token-based authentication with 7-day expiry
- **Professional Email Templates**: Beautiful gradient-styled OTP and welcome emails
- **Email Fallback**: Console logging for development when email service is unavailable

### 📝 **Note Management**
- **CRUD Operations**: Create, read, update, and delete notes with real-time updates
- **User Isolation**: Each user can only access their own notes
- **Accordion UI**: Expandable note cards with smooth animations
- **Optimistic Updates**: Instant UI updates without waiting for server responses

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with desktop split-screen layouts
- **Design System**: Consistent components (Button, Input, Logo, GoogleSignInButton)
- **Animations**: Smooth transitions, loading states, and micro-interactions
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Accessibility**: Proper form labels, keyboard navigation, and screen reader support

## Screenshots

### Sign Up Page
![Sign Up Page](./screenshots/signup_page.png)

### Sign In Page
![Sign In Page](./screenshots/signin_page.png)

### Sign In Mobile View
![Sign In Mobile View](./screenshots/signin_mobile_view.png)

### Dashboard
![Dashboard](./screenshots/dashboard_page.png)

## Technology Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Native fetch for API calls
- Google Sign-In integration

### Backend
- Node.js with Express and TypeScript
- MongoDB with Mongoose ODM
- JWT for authentication
- Nodemailer for OTP emails
- Google OAuth 2.0
- Rate limiting and CORS protection

## Project Structure

```
delights/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── noteController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Note.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── notes.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── email.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Logo.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Button.tsx
│   │   │   └── GoogleSignInButton.tsx
│   │   ├── pages/
│   │   │   ├── SignUp.tsx
│   │   │   ├── VerifyOTP.tsx
│   │   │   ├── SignIn.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd delights
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000`
7. Copy Client ID and Client Secret to your `.env` file

### 5. Email Configuration (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Gmail Settings → Security
   - Select "App passwords"
   - Generate password for "Mail"
3. Use your Gmail address and the generated app password in `.env`

### 6. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 7. Database Setup

Make sure MongoDB is running:

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
- Get connection string and update `MONGODB_URI` in backend `.env`

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: [Your deployed backend URL]/api
```

### Authentication Endpoints

#### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Payload:**
```json
{
  "name": "Jonas Khanwald",
  "email": "jonas@example.com",
  "dateOfBirth": "1990-01-01"  // Optional, ISO date string
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully. OTP sent to email.",
  "userId": "64f5a1b2c3d4e5f6a7b8c9d0"
}
```

**Error Responses:**
- `400`: Validation errors (missing fields, invalid email format)
- `400`: User already exists with this email
- `500`: Server error

**Implementation Details:**
- Generates 6-digit OTP with 10-minute expiry
- Sends professional HTML email with gradient styling
- Creates unverified user record in MongoDB
- Falls back to console logging if email service fails

---

#### 2. OTP Verification (Signup)
**Endpoint:** `POST /api/auth/verify-otp`

**Request Payload:**
```json
{
  "userId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "Jonas Khanwald",
    "email": "jonas@example.com",
    "dateOfBirth": "1990-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing userId or OTP
- `404`: User not found
- `400`: User already verified
- `400`: OTP expired or invalid
- `500`: Server error

**Implementation Details:**
- Marks user as verified and clears OTP fields
- Generates JWT token with 7-day expiry
- Sends welcome email after successful verification
- Token contains userId and email in payload

---

#### 3. User Signin
**Endpoint:** `POST /api/auth/signin`

**Request Payload:**
```json
{
  "email": "jonas@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent to your email. Please verify to sign in.",
  "userId": "64f5a1b2c3d4e5f6a7b8c9d0"
}
```

**Error Responses:**
- `400`: Email is required or invalid format
- `404`: User not found. Please sign up first.
- `401`: Please verify your email first
- `500`: Server error

**Implementation Details:**
- No password required - OTP-based authentication only
- Generates new OTP for existing verified users
- Sends OTP via email with same professional template
- Returns userId for subsequent OTP verification

---

#### 4. OTP Verification (Signin)
**Endpoint:** `POST /api/auth/verify-signin-otp`

**Request Payload:**
```json
{
  "userId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Sign in successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "Jonas Khanwald",
    "email": "jonas@example.com",
    "dateOfBirth": "1990-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Missing userId or OTP
- `404`: User not found
- `401`: User not verified
- `400`: OTP expired or invalid
- `500`: Server error

---

#### 5. Google OAuth
**Endpoint:** `POST /api/auth/google`

**Request Payload:**
```json
{
  "token": "google_id_token_here"
}
```

**Success Response (200):**
```json
{
  "message": "Google authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "Jonas Khanwald",
    "email": "jonas@example.com",
    "dateOfBirth": null
  }
}
```

**Error Responses:**
- `400`: Google token is required
- `400`: Invalid Google token
- `400`: Incomplete Google profile
- `500`: Server error

**Implementation Details:**
- Verifies Google ID token using Google Auth Library
- Creates new user or updates existing user with Google ID
- Automatically marks user as verified
- No OTP required for Google OAuth users

---

### Notes Endpoints (Protected)

**Authentication Required:** All note endpoints require `Authorization: Bearer <jwt_token>` header.

#### 1. Get User Notes
**Endpoint:** `GET /api/notes`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "notes": [
    {
      "id": "64f5a1b2c3d4e5f6a7b8c9d1",
      "title": "My First Note",
      "content": "This is the content of my first note.",
      "createdAt": "2023-09-04T10:30:00.000Z",
      "updatedAt": "2023-09-04T10:30:00.000Z"
    },
    {
      "id": "64f5a1b2c3d4e5f6a7b8c9d2",
      "title": "Shopping List",
      "content": "- Milk\n- Bread\n- Eggs",
      "createdAt": "2023-09-03T15:20:00.000Z",
      "updatedAt": "2023-09-03T15:25:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401`: Access denied. No token provided.
- `401`: Invalid token.
- `500`: Server error

**Implementation Details:**
- Returns notes sorted by updatedAt (newest first)
- Only returns notes belonging to authenticated user
- Uses MongoDB aggregation for efficient querying

---

#### 2. Create Note
**Endpoint:** `POST /api/notes`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Payload:**
```json
{
  "title": "My New Note",
  "content": "This is the content of my new note."
}
```

**Success Response (201):**
```json
{
  "message": "Note created successfully",
  "note": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d3",
    "title": "My New Note",
    "content": "This is the content of my new note.",
    "createdAt": "2023-09-04T12:00:00.000Z",
    "updatedAt": "2023-09-04T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Title and content are required
- `401`: Authentication errors
- `500`: Server error

---

#### 3. Update Note
**Endpoint:** `PUT /api/notes/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Payload:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated note content."
}
```

**Success Response (200):**
```json
{
  "message": "Note updated successfully",
  "note": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d3",
    "title": "Updated Note Title",
    "content": "Updated note content.",
    "createdAt": "2023-09-04T12:00:00.000Z",
    "updatedAt": "2023-09-04T12:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: Title and content are required
- `404`: Note not found
- `401`: Authentication errors
- `500`: Server error

**Implementation Details:**
- Only allows users to update their own notes
- Updates the `updatedAt` timestamp automatically
- Uses MongoDB `findOneAndUpdate` with user validation

---

#### 4. Delete Note
**Endpoint:** `DELETE /api/notes/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "message": "Note deleted successfully"
}
```

**Error Responses:**
- `404`: Note not found
- `401`: Authentication errors
- `500`: Server error

**Implementation Details:**
- Only allows users to delete their own notes
- Uses MongoDB `findOneAndDelete` with user validation
- Permanent deletion (no soft delete implemented)

## Implementation Details

### Authentication Architecture

#### OTP-Based Authentication System
The application uses a passwordless authentication system based on email OTP verification:

**Signup Flow:**
1. **Frontend (SignUp.tsx)**: User fills form with name, email, dateOfBirth
2. **API Call**: `POST /api/auth/signup` with user data
3. **Backend Processing**:
   - Validates email format and required fields
   - Checks for existing users
   - Generates 6-digit OTP using `Math.floor(100000 + Math.random() * 900000)`
   - Creates unverified user record with OTP and 10-minute expiry
   - Sends professional HTML email via Nodemailer
4. **OTP Verification**: User enters OTP, frontend calls `POST /api/auth/verify-otp`
5. **Completion**: Backend verifies OTP, marks user as verified, sends welcome email, returns JWT

**Signin Flow:**
1. **Email Entry**: User enters email only (no password field)
2. **OTP Generation**: Backend generates new OTP for existing verified users
3. **Email Delivery**: Same professional email template as signup
4. **Verification**: `POST /api/auth/verify-signin-otp` validates OTP and returns JWT

**Google OAuth Flow:**
1. **Frontend Integration**: GoogleSignInButton component handles Google Sign-In
2. **Token Verification**: Backend verifies Google ID token using `google-auth-library`
3. **User Management**: Creates new user or links Google ID to existing account
4. **Auto-Verification**: Google users bypass OTP verification

#### Email Service Implementation
**Professional Email Templates** (from memories):
- Gradient headers (#667eea to #764ba2) matching app branding
- Responsive design with max-width 600px
- Personalized with user's name
- Clear OTP display with dashed border highlight
- Call-to-action buttons linking to frontend
- Automatic welcome email after verification

**Transporter Configuration**:
```javascript
// Enhanced configuration with timeout settings
nodemailer.createTransporter({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail app password
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000,    // 30 seconds  
  socketTimeout: 60000       // 60 seconds
});
```

**Fallback Mechanism**: Console logging for development when email service fails

#### JWT Token Management
- **Generation**: Uses `jsonwebtoken` library with HS256 algorithm
- **Payload**: Contains `userId` and `email` 
- **Expiry**: 7 days (`JWT_EXPIRES_IN=7d`)
- **Storage**: Frontend stores in localStorage with keys `hd_notes_token` and `hd_notes_user`
- **Validation**: Middleware extracts from `Authorization: Bearer <token>` header

### Frontend Architecture

#### Component Structure
**Reusable Components**:
- `Logo.tsx`: HD branding with actual logo.png image
- `Button.tsx`: Consistent styling with loading states and variants
- `Input.tsx`: Form inputs with validation styling
- `GoogleSignInButton.tsx`: Google OAuth integration with error handling

**Page Components**:
- `SignUp.tsx`: Two-step form (details → OTP) with mobile-first design
- `SignIn.tsx`: Desktop split-screen layout (form left, image right)  
- `Dashboard.tsx`: Note management with accordion UI and animations
- `VerifyOTP.tsx`: Standalone OTP verification page

#### State Management
**Local State with useState**:
- Form data management with controlled inputs
- Loading states for async operations
- Error handling with user-friendly messages
- Step management for multi-step flows

**Authentication State**:
```javascript
// authUtils.js - localStorage-based auth management
const authUtils = {
  setToken: (token) => localStorage.setItem('hd_notes_token', token),
  getToken: () => localStorage.getItem('hd_notes_token'),
  setUser: (user) => localStorage.setItem('hd_notes_user', JSON.stringify(user)),
  getUser: () => JSON.parse(localStorage.getItem('hd_notes_user') || 'null'),
  logout: () => { /* clear both token and user */ },
  isAuthenticated: () => !!localStorage.getItem('hd_notes_token')
};
```

#### UI/UX Implementation
**Responsive Design** (from memories):
- Mobile-centered SignUp with single column layout
- Desktop split-screen SignIn with left form, right image
- Proper logo placement (top-left desktop, centered mobile)

**Animations & Interactions**:
- Smooth transitions with Tailwind CSS classes
- Loading spinners and disabled states
- Hover effects and micro-interactions
- Accordion notes with expand/collapse animations

### Backend Architecture

#### Database Models
**User Schema** (`models/User.ts`):
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  dateOfBirth: { type: Date },
  password: { type: String, minlength: 6 }, // Optional for Google users
  googleId: { type: String, sparse: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date }
}
```

**Note Schema** (`models/Note.ts`):
```javascript
{
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  userId: { type: ObjectId, ref: 'User', required: true }
}
```

#### Middleware & Security
**Authentication Middleware** (`middleware/auth.ts`):
- Extracts JWT from Authorization header
- Verifies token and loads user data
- Attaches user to request object for controllers

**Security Features**:
- Rate limiting: 100 requests per 15 minutes per IP
- CORS configuration with specific origins
- Input validation and sanitization
- Secure HTTP headers
- Password hashing with bcrypt (salt rounds: 12)

#### API Error Handling
**Consistent Error Responses**:
```javascript
// Frontend ApiError class
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Backend error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
```

### Note Management System

#### CRUD Operations
**Optimistic Updates**: Frontend immediately updates UI before server confirmation
**User Isolation**: MongoDB queries include `userId` filter for security
**Real-time Sync**: Notes sorted by `updatedAt` for consistent ordering

#### Dashboard Features
**Accordion UI**: Expandable note cards with smooth animations
**Infinite Scroll**: Handled with `max-height` and `overflow-y-auto`
**Modal Creation**: Overlay modal for creating new notes
**Delete Confirmation**: One-click delete with optimistic UI updates

### Development Workflow

#### Environment Configuration
**Backend (.env)**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Build & Deployment
**Backend Build Process**:
- TypeScript compilation to `dist/` directory
- Production server runs compiled JavaScript
- Environment variables loaded via dotenv

**Frontend Build Process**:
- Create React App build system
- Tailwind CSS compilation
- Static assets optimization
- Production bundle in `build/` directory

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation and sanitization
- Secure HTTP headers

### UI/UX Features

- Responsive design for mobile and desktop
- Loading states and error handling
- Beautiful gradient backgrounds matching design
- Smooth transitions and animations
- Accessible form controls

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity for Atlas

2. **Email OTP Not Sending:**
   - Verify Gmail app password
   - Check email configuration in `.env`
   - Ensure 2FA is enabled on Gmail

3. **Google OAuth Not Working:**
   - Verify Google Client ID in both frontend and backend
   - Check authorized origins in Google Console
   - Ensure Google+ API is enabled

4. **CORS Errors:**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if both servers are running

### Development Tips

- Use browser developer tools to debug API calls
- Check browser console for frontend errors
- Monitor backend logs for server errors
- Use MongoDB Compass to inspect database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
