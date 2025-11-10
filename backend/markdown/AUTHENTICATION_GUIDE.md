# Authentication & Authorization System

## Overview

The Unified Learning Lab now features a robust, production-ready authentication and authorization system with modern security practices.

## Features Implemented

### 🔐 Security Features

1. **Enhanced Password Security**

   - Bcrypt hashing with salt rounds of 12
   - Password strength validation (minimum 8 characters, uppercase, lowercase, number, special character)
   - Password reset functionality with time-limited tokens

2. **JWT Token Management**

   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Automatic token refresh mechanism
   - HttpOnly cookies for secure token storage
   - Token expiration handling

3. **Account Security**

   - Account lockout after 5 failed login attempts (2-hour lock)
   - Rate limiting on authentication endpoints
   - Email verification system
   - Password reset with secure tokens

4. **Input Validation & Sanitization**

   - Express-validator for comprehensive input validation
   - Email normalization
   - SQL injection and XSS protection

5. **Rate Limiting**
   - Login attempts: 5 per 15 minutes
   - Registration: 5 per hour per IP
   - Password reset: 3 per hour per IP
   - General API: 100 requests per 15 minutes

### 🔑 Authentication Endpoints

#### Public Routes

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isEmailVerified": false,
    "permissions": ["read"]
  }
}
```

---

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

---

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

---

```http
POST /api/auth/forgotpassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

---

```http
PUT /api/auth/resetpassword/:resettoken
Content-Type: application/json

{
  "password": "NewSecurePass123!"
}
```

---

```http
GET /api/auth/verifyemail/:token
```

#### Protected Routes (Require Authentication)

```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

```http
PUT /api/auth/updatedetails
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

---

```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

---

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### 🛡️ Authorization Middleware

#### Role-Based Access Control

```javascript
const { protect, authorize } = require("./middleware/auth");

// Protect route - requires authentication
router.get("/protected", protect, handler);

// Authorize specific roles
router.delete("/admin-only", protect, authorize("admin"), handler);

// Multiple roles
router.post("/staff", protect, authorize("teacher", "admin"), handler);
```

#### Permission-Based Access Control

```javascript
const { protect, checkPermission } = require("./middleware/auth");

// Check specific permissions
router.post("/create", protect, checkPermission("write", "admin"), handler);
router.delete("/delete", protect, checkPermission("delete", "admin"), handler);
```

#### Email Verification Check

```javascript
const { protect, requireEmailVerification } = require("./middleware/auth");

router.get("/premium-content", protect, requireEmailVerification, handler);
```

#### Optional Authentication

```javascript
const { optionalAuth } = require("./middleware/auth");

// User data is attached if token is present, but route doesn't fail without it
router.get("/public-with-user", optionalAuth, handler);
```

### 📊 User Model

```javascript
{
  name: String,              // User's full name
  email: String,             // Email (unique, validated)
  password: String,          // Hashed password (not returned by default)
  role: String,              // 'student', 'teacher', 'admin'
  isEmailVerified: Boolean,  // Email verification status
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,      // Hashed refresh token
  loginAttempts: Number,     // Failed login count
  lockUntil: Date,           // Account lock expiration
  lastLogin: Date,           // Last successful login
  isActive: Boolean,         // Account active status
  permissions: [String],     // 'read', 'write', 'delete', 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### 🎨 Frontend Components

#### Login/Register Page

- Enhanced UI with error handling
- Forgot password link
- Password strength indicator (on register)
- Validation error display

#### Forgot Password Page

- Email input form
- Success/error messages
- Link back to login

#### Reset Password Page

- New password input
- Password strength meter
- Password requirements display
- Confirmation input

### 🔄 Token Refresh Flow

The frontend automatically handles token refresh:

1. Access token expires (15 minutes)
2. API request fails with `TOKEN_EXPIRED` error
3. Client automatically calls refresh endpoint with refresh token
4. New tokens are issued and stored
5. Original request is retried with new token
6. Process is transparent to user

### 🚦 Error Handling

#### Status Codes

- `200` - Success
- `201` - Created
- `400` - Validation Error
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `423` - Locked (account locked due to failed attempts)
- `429` - Too Many Requests (rate limit exceeded)

#### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRE=7d

# Cookie Configuration
COOKIE_EXPIRE=7

# Email Configuration (for password reset & verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@learninglab.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Installation

### Backend

```bash
cd backend
npm install
```

New dependencies added:

- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation
- `cookie-parser` - Cookie handling

### Frontend

```bash
cd frontend
npm install
```

No additional dependencies required.

## Usage Examples

### Protecting a Route

```javascript
const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Anyone authenticated
router.get("/profile", protect, async (req, res) => {
  res.json({ user: req.user });
});

// Admin only
router.delete("/users/:id", protect, authorize("admin"), async (req, res) => {
  // Delete user logic
});

// Teachers and admins
router.post(
  "/courses",
  protect,
  authorize("teacher", "admin"),
  async (req, res) => {
    // Create course logic
  }
);
```

### Frontend Authentication

```javascript
import { authService } from "./api/services";

// Login
try {
  const response = await authService.login(email, password);
  // User is automatically logged in, tokens are stored
} catch (error) {
  if (error.status === 423) {
    // Account is locked
  } else if (error.errors) {
    // Validation errors
  }
}

// Get current user
const user = await authService.getCurrentUser();

// Update password
await authService.updatePassword({
  currentPassword: "old",
  newPassword: "new",
});

// Logout
await authService.logout();
```

## Security Best Practices

✅ **Implemented:**

- Passwords are never stored in plain text
- JWT secrets are environment variables
- Tokens expire and must be refreshed
- Rate limiting prevents brute force attacks
- Account lockout after failed attempts
- Input validation and sanitization
- CORS configured properly
- Helmet.js for security headers
- HttpOnly cookies for token storage

⚠️ **TODO for Production:**

- Implement email service for verification and password reset
- Use HTTPS in production
- Configure proper CORS origins
- Set up Redis for rate limiting (scalability)
- Add 2FA/MFA support
- Implement audit logging
- Add CAPTCHA on login/register
- Set up monitoring and alerts

## Testing

Use tools like Postman or cURL to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test123!@#"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'

# Access protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

## Troubleshooting

### Token Expired Errors

- Access tokens expire after 15 minutes
- Use refresh token to get new access token
- Frontend handles this automatically

### Account Locked

- Occurs after 5 failed login attempts
- Lock lasts for 2 hours
- Contact admin or wait for lock to expire

### Validation Errors

- Check password requirements (8+ chars, uppercase, lowercase, number, special char)
- Ensure email is valid format
- Name must be 2-50 characters

## Migration Guide

If upgrading from old authentication:

1. **Install new dependencies:**

   ```bash
   cd backend
   npm install express-rate-limit express-validator cookie-parser
   ```

2. **Update environment variables** - Add new JWT and email configs

3. **Update frontend** - New password reset routes added

4. **Database migration** - User schema updated with new fields. Existing users will have defaults applied.

5. **Test thoroughly** - Especially login, registration, and token refresh

## Support

For issues or questions:

- Check the error message and status code
- Review this documentation
- Check browser console for frontend errors
- Check server logs for backend errors

---

**Version:** 2.0.0
**Last Updated:** October 28, 2025
**Author:** Unified Learning Lab Team
