# 🚀 Accio Mentor Connect - MERN Stack Starter

A beginner-friendly MERN (MongoDB, Express, React, Node.js) starter repository for a mentorship platform with complete authentication system.

## 🧱 Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Axios** for direct API calls
- **Tailwind CSS** for styling
- **Responsive Sidebar** for navigation

### Backend
- **Node.js & Express.js**
- **MongoDB with Mongoose**
- **JWT Authentication** (localStorage-based)
- **bcryptjs** for password hashing

## 📁 Project Structure

```
mentor-connect/
├── server/              # Backend API
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Business logic
│   │   ├── middlewares/ # Auth & error handling
│   │   ├── models/      # MongoDB schemas
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
    │   ├── services/    # API client
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
- ✅ JWT stored in localStorage
- ✅ Protected routes
- ✅ Auto-redirect to login when unauthorized

### User Management
- ✅ Update profile (name, email)
- ✅ View current user info

### Frontend Pages
- ✅ Login Page
- ✅ Register Page
- ✅ Dashboard (with sidebar navigation)
- ✅ Profile (view & edit)
- ✅ Responsive Sidebar with logout

### UI Components
- ✅ Reusable sidebar with navigation
- ✅ Header with menu toggle
- ✅ Forms with validation
- ✅ Alert messages (error/success)
- ✅ Loading states

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
MONGODB_URI=mongodb://localhost:27017/accio-mentor-connect
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
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### User Routes (Protected)
- `PUT /users/profile` - Update current user profile
- Go to `/login`
- Enter credentials
- Click logout in sidebar

### 3. Forgot Password
- Go to `/forgot-password`
- Enter email (requires SMTP setup for email)
- Check console/email for reset link

### 4. Magic Link
- Go to `/magic-link`
- Enter email
- Click link from email (or use token in URL)

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
- ✅ JWT in HTTP-only cookies (no XSS vulnerability)
- ✅ CORS configured with credentials

## 🧪 Authentication Flow

### 1. Register
1. Navigate to `/register`
2. Fill in name, email, password
3. Submit form
4. Redirected to `/dashboard`
5. Token stored in localStorage

### 2. Login
1. Navigate to `/login`
2. Enter email and password
3. Submit form
4. Token stored in localStorage
5. Redirected to `/dashboard`

### 3. Access Protected Routes
- Dashboard and Profile pages are protected
- ProtectedRoute component checks for token
- If no token, redirected to login
- Token checked on every route access

### 4. Logout
1. Click logout button in sidebar
2. Token removed from localStorage
3. Redirected to `/login`

## 📝 State Management

No Redux or Context API - components manage their own state:
- **LoginPage**: form state (`email`, `password`)
- **RegisterPage**: form state (`name`, `email`, `password`, `passwordConfirm`)
- **ProfilePage**: form state (`name`, `email`)
- **DashboardPage**: presentational only
- **Sidebar**: handles logout directly

Authentication state stored in:
- **localStorage**: `authToken` (user ID from backend)

## 🔄 API Integration

All API calls made directly from components using Axios:

```javascript
// Example: LoginPage
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', formData);
    localStorage.setItem('authToken', response.data.user.id);
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};
```

**API Configuration:**
- baseURL: `http://localhost:5000`
- withCredentials: `true` (for cookies if needed)

## 💾 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
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
│       └── Profile
└── Auth Pages (no layout)
    ├── LoginPage
    └── RegisterPage
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Deploy to platform
2. Set environment variables
3. MongoDB connection string

### Frontend (Vercel/Netlify)
1. Run `npm run build`
2. Deploy dist folder or connect Git repo
3. Set API URL if deploying to different server

## 📚 Common Tasks

### Add a New Page
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Wrap with `ProtectedRoute` if needed
4. Add to sidebar menu in `Sidebar.jsx`

### Add a New API Call
1. Use `api` from `src/services/api.js`
2. Example: `await api.post('/endpoint', data)`
3. Handle errors with try/catch
4. Update localStorage if needed

### Customize Styling
- Tailwind CSS classes in components
- Theme colors in `tailwind.config.js`
- Global styles in `index.css`

## 🐛 Troubleshooting

### "Could not find module" errors
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Authentication not working
- Check localStorage has `authToken` after login
- Verify backend is running on port 5000
- Check network tab in browser DevTools

### Sidebar not appearing
- Make sure you're on a protected route
- Check ProtectedRoute wrapper exists
- Verify token is in localStorage

### API calls failing
- Check backend server is running
- Verify `.env` API URL matches backend
- Check CORS is enabled in backend

## 📄 License

MIT - Feel free to use for learning and projects!

**Happy Coding! 🎉**

