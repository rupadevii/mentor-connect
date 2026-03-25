# Accio Mentor Connect - Client

Frontend React application for Accio Mentor Connect with Redux Toolkit state management.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

App will open at `http://localhost:5173`

## 📁 Folder Structure

```
src/
├── app/              # Redux store
├── components/       # Reusable components
│   ├── layout/      # Sidebar, Header, Layout
│   └── ui/          # Button, Input, Modal, Alert, Loader
├── features/        # Redux slices
│   ├── auth/        # Auth state & thunks
│   └── users/       # Users state & thunks
├── hooks/           # Custom hooks (useAuth, useUsers)
├── pages/           # Page components
│   ├── LoginPage
│   ├── RegisterPage
│   ├── DashboardPage
│   ├── ProfilePage
│   ├── UsersPage
│   └── ...
├── routes/          # ProtectedRoute component
├── services/        # API service (axios)
├── utils/           # Helper functions
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Tailwind CSS
```

## 🧠 Redux Setup

### Store (src/app/store.js)
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
});
```

### Using Redux in Components
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);

  const handleSubmit = (credentials) => {
    dispatch(loginUser(credentials));
  };
}
```

### Custom Hooks
```javascript
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useAuth';

function MyComponent() {
  const auth = useAuth();        // { user, loading, isAuthenticated, error }
  const users = useUsers();      // { users, loading, error }
}
```

## 🔐 Auth Flow

### 1. On App Load
- Check if user has valid token in cookies
- If yes, set isAuthenticated = true
- If no, redirect to login

### 2. Login/Register
- Submit form data to backend
- Backend returns user info & sets JWT cookie
- Redux updates auth state
- App redirects to dashboard

### 3. Protected Routes
- `<ProtectedRoute>` checks isAuthenticated
- If not authenticated, redirects to login
- If loading, shows spinner

### 4. Logout
- Clear Redux state
- Clear cookies (backend handles)
- Redirect to login

## 📝 API Integration

### Axios Instance (src/services/api.js)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Send cookies
});

export default api;
```

### Using API in Thunks
```javascript
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
```

## 🎨 UI Components

### Button
```jsx
<Button variant="primary" onClick={() => {}}>
  Click me
</Button>
```
Variants: `primary`, `secondary`, `danger`, `success`

### Input
```jsx
<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  error={errorMessage}
/>
```

### Loader
```jsx
<Loader />
```

### Modal
```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
  Content here
</Modal>
```

### Alert
```jsx
<Alert 
  type="success"
  message="Success!" 
  onClose={() => {}}
/>
```

## 📄 Pages

### Authentication Pages

#### LoginPage (`/login`)
- Email & password form
- Social login buttons (UI only)
- Forgot password link
- Magic link option
- Redirect if already logged in

#### RegisterPage (`/register`)
- Name, email, password form
- Password confirmation
- Link to login page

#### ForgotPasswordPage (`/forgot-password`)
- Email input
- Sends reset link to email
- Shows success message

#### ResetPasswordPage (`/reset-password?token=xxx`)
- New password & confirmation
- Token from URL
- Logs in user after reset

#### MagicLinkPage (`/magic-link`)
- Email input
- Sends magic link to email

#### MagicLoginPage (`/magic-login?token=xxx`)
- Auto-logs in with token
- Shows loading spinner

### App Pages (Protected)

#### DashboardPage (`/dashboard`)
- User stats card
- Total users count
- Current user info
- Quick stats

#### ProfilePage (`/profile`)
- Display current user info
- Edit form for name & email
- Show member since date

#### UsersPage (`/users`)
- Table of all users
- Name, email, level columns
- Dropdown to change level
- User statistics

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
1. Connect GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add env vars

## 📚 Tailwind CSS

All styling uses Tailwind CSS. Common classes:

```jsx
// Layout
<div className="flex justify-between items-center">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// Colors
className="bg-blue-600 text-white"
className="hover:bg-blue-700"
className="disabled:bg-gray-400"

// Spacing
className="px-4 py-2 mb-4"
className="gap-4 p-6"

// Responsive
className="hidden sm:block md:flex"
className="w-full md:w-1/2"
```

## 🔄 Redux State Examples

### Auth State
```javascript
{
  user: {
    id: "123",
    name: "John",
    email: "john@example.com",
    level: 1
  },
  isAuthenticated: true,
  loading: false,
  error: null,
  successMessage: null
}
```

### Users State
```javascript
{
  users: [
    { _id: "1", name: "John", email: "john@ex.com", level: 1 },
    { _id: "2", name: "Jane", email: "jane@ex.com", level: 5 }
  ],
  loading: false,
  error: null
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with credentials
- [ ] View dashboard
- [ ] Update profile
- [ ] View all users
- [ ] Update user level
- [ ] Logout
- [ ] Try to access protected route (should redirect)
- [ ] Forgot password flow
- [ ] Magic link flow

### Console Tips
- Check Redux DevTools extension
- View network requests (Network tab)
- Check cookies (Application -> Cookies)
- Check localStorage

## 🐛 Troubleshooting

### "withCredentials is not working"
- Check backend CORS settings
- Verify API URL is correct
- Check cookie attributes (httpOnly, sameSite)

### "Redux state not updating"
- Check Redux DevTools
- Verify async thunk is dispatched
- Check reducer extraReducers

### "Page not found"
- Verify route path in App.jsx
- Check React Router setup
- Clear browser cache

### "Cookies not persisting"
- Check backend is setting cookies
- Verify withCredentials in axios
- Check domain/sameSite settings

## 📖 Learn More

- React: https://react.dev/
- Redux Toolkit: https://redux-toolkit.js.org/
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/
- Tailwind CSS: https://tailwindcss.com/

## 🔗 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000 |

## 🚀 Performance Tips

- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Use Redux selectors to prevent re-renders
- Optimize images
- Enable gzip compression

---

**Need help?** Check the component code comments!
