# 🚀 Mentor Connect - MERN Stack Session Booking Platform

A full-stack MERN (MongoDB, Express, React, Node.js) mentorship platform where mentors create sessions and mentees book them, with a complete two-way feedback system.

## 🧱 Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Axios** via a centralized `api` service abstraction
- **Tailwind CSS** for styling
- **Responsive Sidebar** for navigation

### Backend
- **Node.js & Express.js** (with `asyncHandler` for cleaner controller error handling)
- **MongoDB with Mongoose**
- **JWT Authentication** stored in HTTP-only cookies (no localStorage — protects against XSS)
- **bcryptjs** for password hashing

## 📁 Project Structure

```
mentor-connect/
├── server/              # Backend API
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Business logic
│   │   ├── middlewares/ # Auth & error handling
│   │   ├── models/      # MongoDB schemas (User, Session)
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Helper functions
│   │   └── index.js     # Server entry point
│   ├── package.json
│   └── .env.example
│
└── client/              # Frontend App
    ├── src/
    │   ├── components/  # Reusable components (layout, UI)
    │   ├── pages/       # Page components
    │   ├── routes/      # Protected route logic
    │   ├── services/    # API client (api.js)
    │   ├── utils/       # Helper functions
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── package.json
    ├── vite.config.js
    └── .env.example
```

## 🔐 Features

### Authentication
- ✅ User Registration
- ✅ Login/Logout
- ✅ JWT stored in HTTP-only cookies
- ✅ Protected routes
- ✅ Auto-redirect to login when unauthorized

### User Management
- ✅ Update profile (name, email)
- ✅ View current user info
- ✅ Two roles: Mentor and Mentee

### Sessions
- ✅ Mentors create sessions (topic, schedule, capacity, etc.)
- ✅ Mentees browse and book available sessions
- ✅ A scheduled cron job automatically marks sessions as `COMPLETED` once their end time passes

### Feedback System
- ✅ Embedded `mentorFeedback` and `menteeFeedback` sub-documents on the Session model
- ✅ Role-based visibility of feedback (mentors and mentees see different views)
- ✅ Mentee level-up by mentor
- ✅ 1–5 star mentee ratings for sessions

### Frontend Pages
- ✅ Login Page
- ✅ Register Page
- ✅ Dashboard (role-aware, with sidebar navigation)
- ✅ Session listing / booking pages
- ✅ Feedback submission & viewing
- ✅ Profile (view & edit)
- ✅ Responsive Sidebar with logout

### UI Components
- ✅ Reusable `Button` component (variants: primary, secondary, danger, success)
- ✅ Form `Input` component
- ✅ Loading spinner (`Loader`)
- ✅ Modal dialog
- ✅ Alert messages (success/error)

## ⚡ Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to server folder**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Update `.env` with your values**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mentor-connect
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Start the server**
```bash
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client folder**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔗 API Endpoints

### Auth Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user (sets HTTP-only cookie)
- `POST /auth/logout` - Logout user (clears cookie)
- `GET /auth/me` - Get current user (protected)

### User Routes (Protected)
- `PUT /users/profile` - Update current user profile

### Session Routes (Protected)
- `POST /sessions` - Mentor creates a session
- `GET /sessions` - List available sessions
- `POST /sessions/:id/book` - Mentee books a session
- `GET /sessions/:id` - Get session details (includes `canJoin` status)

### Feedback Routes (Protected)
- `POST /sessions/:id/feedback/mentor` - Mentor submits feedback (level-up toggle)
- `POST /sessions/:id/feedback/mentee` - Mentee submits feedback (star rating)
- `GET /sessions/:id/feedback` - Get feedback for a session (role-based visibility, double-blind gated)

## 🎨 UI Components

All components are in `client/src/components/`

### Layout
- `Sidebar.jsx` - Navigation sidebar
- `Header.jsx` - Top header
- `Layout.jsx` - Main layout wrapper

### UI
- `Button.jsx` - Reusable button (variants: primary, secondary, danger, success)
- `Input.jsx` - Form input
- `Loader.jsx` - Loading spinner
- `Modal.jsx` - Modal dialog
- `Alert.jsx` - Alert messages (success/error)

## 📦 Scripts

### Backend
```bash
npm run dev    # Start with nodemon (development)
npm start      # Start server (production)
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔒 Security Features

- ✅ Passwords hashed with bcryptjs
- ✅ JWT in HTTP-only cookies (mitigates XSS token theft)
- ✅ CORS configured with credentials

## 🧪 Authentication Flow

### 1. Register
1. Navigate to `/register`
2. Fill in name, email, password, and role (mentor/mentee)
3. Submit form
4. Redirected to `/dashboard`
5. JWT set as an HTTP-only cookie by the server

### 2. Login
1. Navigate to `/login`
2. Enter email and password
3. Submit form
4. JWT set as an HTTP-only cookie by the server
5. Redirected to `/dashboard`

### 3. Access Protected Routes
- Dashboard, Sessions, and Profile pages are protected
- `ProtectedRoute` component checks auth state via `/auth/me`
- If unauthenticated, redirected to login

### 4. Logout
1. Click logout button in sidebar
2. Server clears the auth cookie
3. Redirected to `/login`

## 💾 Database Schema (Simplified)

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: 'mentor' | 'mentee'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Session Model
```javascript
{
  mentor: ObjectId (ref: User),
  mentee: ObjectId (ref: User),
  topic: String,
  startTime: Date,
  endTime: Date,
  mentorFeedback: {
    levelUp: Boolean,      // binary yes/no toggle
    submittedAt: Date
  },
  menteeFeedback: {
    rating: Number,        // 1-5 stars
    submittedAt: Date
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 📦 Component Hierarchy

```
App
├── Layout (for protected routes)
│   ├── Sidebar (navigation + logout)
│   ├── Header (menu toggle, title)
│   └── Page Content
│       ├── Dashboard
│       ├── Sessions (list/book/create)
│       ├── Feedback
│       └── Profile
└── Auth Pages (no layout)
    ├── LoginPage
    └── RegisterPage
```

## 🚀 Deployment

#### Backend - Render
#### Frontend - Vercel

## 🛠️ Limitations

**Email notifications are not functional in production.** The feature (session reminders) was built with Nodemailer, but Render's hosting blocks the outbound SMTP ports Nodemailer needs. A production-ready fix would involve switching to an HTTP-based email API (e.g. Resend/SendGrid), which requires a verified sending domain — out of scope for this project for now. Functional during development
