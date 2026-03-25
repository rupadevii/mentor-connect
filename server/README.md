# Accio Mentor Connect - Server

Backend API for Accio Mentor Connect platform with complete authentication and user management.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```

### 3. Update `.env` with your values

### 4. Install MongoDB (if not already installed)
- **macOS**: `brew install mongodb-community`
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Linux**: `sudo apt-get install mongodb`

### 5. Start MongoDB
```bash
mongod
```

### 6. Start the server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📁 Folder Structure

```
src/
├── config/       # Database configuration
├── controllers/  # Request handlers
├── middlewares/  # Auth & error handling
├── models/       # MongoDB schemas
├── routes/       # API routes
├── utils/        # Helper functions
└── index.js      # Entry point
```

## 🔗 API Endpoints

All responses are JSON.

### Authentication Endpoints

#### Register
```
POST /auth/register
Body: { name, email, password, passwordConfirm }
Response: { success: true, user: { id, name, email, level } }
```

#### Login
```
POST /auth/login
Body: { email, password }
Response: { success: true, user: { id, name, email, level } }
```

#### Get Current User
```
GET /auth/me
Headers: Cookie: token=...
Response: { success: true, user: { id, name, email, level } }
```

#### Logout
```
POST /auth/logout
Response: { success: true, message: "Logged out successfully" }
```

#### Forgot Password
```
POST /auth/forgot-password
Body: { email }
Response: { success: true, message: "Email sent successfully" }
```

#### Reset Password
```
POST /auth/reset-password
Body: { token, password, passwordConfirm }
Response: { success: true, user: { id, name, email, level } }
```

#### Magic Link
```
POST /auth/magic-link
Body: { email }
Response: { success: true, message: "Magic link sent to email" }
```

#### Magic Login
```
POST /auth/magic-login
Body: { token }
Response: { success: true, user: { id, name, email, level } }
```

### User Endpoints (All require authentication)

#### Get All Users
```
GET /users
Response: { success: true, count, users: [...] }
```

#### Get User by ID
```
GET /users/:id
Response: { success: true, user: {...} }
```

#### Update User Level
```
PATCH /users/:id/level
Body: { level }
Response: { success: true, message: "User level updated successfully", user: {...} }
```

#### Update Profile
```
PUT /users/profile
Body: { name, email }
Response: { success: true, message: "Profile updated successfully", user: {...} }
```

## 🔐 Authentication

- Tokens are stored in **HTTP-only cookies**
- Cannot be accessed by JavaScript (XSS protection)
- Automatically sent with requests (CORS: credentials)
- Valid for 7 days by default

## 🧪 Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123","passwordConfirm":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (requires cookie)
curl -X GET http://localhost:5000/auth/me \
  -b cookies.txt
```

### Using Postman

1. Create new POST request
2. Set URL and headers
3. Add JSON body
4. Enable "Cookies" to persist auth

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/accio |
| JWT_SECRET | Secret key for JWT signing | your_secret_key |
| JWT_EXPIRY | Token expiration time | 7d |
| CLIENT_URL | Frontend URL | http://localhost:5173 |
| SMTP_HOST | Email SMTP host | smtp.gmail.com |
| SMTP_PORT | Email SMTP port | 587 |
| SMTP_USER | Email account | your@gmail.com |
| SMTP_PASS | Email password/app-password | your_password |
| SMTP_FROM | Sender email | noreply@acciomentor.com |

## 📚 Code Explanation

### Middleware (src/middlewares/)

**auth.js** - JWT verification from cookies
```javascript
export const protect = (req, res, next) => {
  // Verifies token from cookie
  // Sets req.userId if valid
  // Returns 401 if invalid/missing
}
```

**errorHandler.js** - Global error handling
```javascript
export const errorHandler = (err, req, res, next) => {
  // Handles all errors from routes
  // Returns appropriate status codes
}

export const asyncHandler = (fn) => (req, res, next) => {
  // Wraps async functions to catch errors
  // Passes errors to errorHandler
}
```

### Controllers (src/controllers/)

**authController.js** - Authentication logic
- `register()` - Create new user
- `login()` - Authenticate user
- `logout()` - Clear token
- `getMe()` - Get current user
- `forgotPassword()` - Send reset email
- `resetPassword()` - Update password
- `sendMagicLink()` - Send login link
- `magicLogin()` - Authenticate with magic link

**userController.js** - User management
- `getAllUsers()` - Fetch all users
- `getUserById()` - Fetch single user
- `updateUserLevel()` - Change user level
- `updateProfile()` - Update user info

## 🔒 Security Best Practices

✅ Passwords hashed with bcryptjs (salt rounds: 10)
✅ JWT stored in HTTP-only cookies
✅ CORS configured with credentials
✅ Password validation (min 6 chars)
✅ Email validation
✅ Protected routes with auth middleware
✅ Error messages don't leak sensitive info
✅ Timestamps on all documents

## 🚀 Deployment

### Heroku
```bash
heroku create accio-mentor-api
git push heroku main
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongo_uri
```

### Railway
1. Connect GitHub repo
2. Set environment variables
3. Deploy automatically

### DigitalOcean
1. Create App Platform
2. Connect GitHub
3. Set env vars
4. Deploy

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check mongod is running
- Verify connection string format
- Check network access (if using Atlas)

### JWT Errors
- Clear browser cookies
- Check token expiry in .env
- Verify JWT_SECRET matches between sessions

### Email Not Sending
- Enable Less Secure Apps (Gmail)
- Generate app-specific password
- Check SMTP credentials in .env

### CORS Errors
- Verify CLIENT_URL in .env
- Check it matches frontend origin
- Ensure credentials: true in axios

## 📖 Learn More

- Express.js: https://expressjs.com/
- MongoDB: https://www.mongodb.com/
- Mongoose: https://mongoosejs.com/
- JWT: https://jwt.io/

---

**Need help?** Check the code comments and console logs!
