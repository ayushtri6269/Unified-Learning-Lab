# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      UNIFIED LEARNING LAB                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌─────────────┐
│                  │      │                  │      │             │
│   React Frontend │◄────►│  Express Backend │◄────►│   MongoDB   │
│   (Port 3000)    │ HTTP │   (Port 5000)    │      │  Database   │
│                  │      │                  │      │             │
└──────────────────┘      └──────────────────┘      └─────────────┘
         │                         │
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Unified Site    │      │   API Endpoints  │
│  (Static HTML)   │      │  /auth, /questions│
│                  │      │  /results         │
└──────────────────┘      └──────────────────┘
```

## Backend Architecture (MVC + Services Pattern)

```
┌─────────────────────────────────────────────────────────────────┐
│                         REQUEST FLOW                             │
└─────────────────────────────────────────────────────────────────┘

Client Request
      │
      ▼
┌─────────────┐
│   Routes    │  ── Define endpoints
│ (routes/)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  ── Auth, Validation, Error Handling
│(middleware/)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controllers │  ── Handle HTTP logic
│(controllers)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  ── Business logic
│ (services/) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Models    │  ── Database interaction
│  (models/)  │
└──────┬──────┘
       │
       ▼
    Response
```

## Frontend Architecture (Component-Based)

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND STRUCTURE                          │
└─────────────────────────────────────────────────────────────────┘

                        App.jsx
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   AuthProvider       Router Layout      Global State
        │                  │                  │
        │         ┌────────┼────────┐         │
        │         │        │        │         │
        │         ▼        ▼        ▼         │
        │     Navbar   Sidebar   Content      │
        │                  │                  │
        │         ┌────────┼────────┐         │
        │         │        │        │         │
        │         ▼        ▼        ▼         │
        │       Pages   Pages    Pages        │
        │      (Home) (Dashboard) (Tests)     │
        │         │        │        │         │
        └─────────┴────────┴────────┴─────────┘
                           │
                           ▼
                    API Services
                           │
                           ▼
                    Backend API
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER AUTHENTICATION                         │
└─────────────────────────────────────────────────────────────────┘

User Input (Login)
      │
      ▼
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ AuthContext │  ── Manages auth state
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Service │  ── authService.login()
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Client  │  ── Axios instance
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Auth Route  │  ── POST /api/auth/login
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Auth Ctrl   │  ── Validate credentials
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ User Model  │  ── Query database
└──────┬──────┘
       │
       ▼
  JWT Token Generated
       │
       ▼
  Token stored in localStorage
       │
       ▼
  User redirected to Dashboard
```

## Folder Structure Details

```
unified-learning-lab/
│
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── database.js      # MongoDB connection
│   │   │   └── env.js           # Environment variables
│   │   │
│   │   ├── controllers/         # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── questionController.js
│   │   │   └── resultController.js
│   │   │
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── errorHandler.js  # Global error handling
│   │   │   └── validator.js     # Input validation
│   │   │
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Question.js
│   │   │   └── Result.js
│   │   │
│   │   ├── routes/              # API routes
│   │   │   ├── auth.js
│   │   │   ├── questions.js
│   │   │   └── results.js
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── authService.js
│   │   │   ├── questionService.js
│   │   │   └── resultService.js
│   │   │
│   │   ├── utils/               # Helper functions
│   │   │   ├── asyncHandler.js
│   │   │   └── logger.js
│   │   │
│   │   ├── validators/          # Validation schemas
│   │   │   └── schemas.js
│   │   │
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Entry point
│   │
│   └── tests/                   # Test files
│       ├── unit/
│       └── integration/
│
├── frontend/
│   ├── src/
│   │   ├── api/                 # API integration
│   │   │   ├── client.js        # Axios instance
│   │   │   └── services.js      # API methods
│   │   │
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   └── Sidebar/
│   │   │       ├── Sidebar.jsx
│   │   │       └── Sidebar.css
│   │   │
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── hooks/               # Custom hooks
│   │   │   └── index.js
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   └── helpers.js
│   │   │
│   │   ├── constants/           # Constants
│   │   │   └── index.js
│   │   │
│   │   ├── styles/              # Global styles
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx              # Main component
│   │   └── index.js             # Entry point
│   │
│   └── public/                  # Static assets
│       └── index.html
│
└── unified-site/                # Static site
    ├── js/
    ├── css/
    └── pages/
```

## Key Design Patterns

### 1. MVC Pattern (Backend)

- **Model**: Database schemas (Mongoose models)
- **View**: JSON responses
- **Controller**: Request handling logic

### 2. Service Layer Pattern

- Separates business logic from controllers
- Makes code more testable and maintainable

### 3. Middleware Chain

```
Request → Auth → Validation → Controller → Service → Model → Response
```

### 4. Context API (Frontend)

- AuthContext for global authentication state
- Reduces prop drilling

### 5. Custom Hooks

- Reusable logic (useFetch, useForm)
- Cleaner components

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY MEASURES                           │
└─────────────────────────────────────────────────────────────────┘

1. Helmet.js          ── HTTP headers security
2. CORS               ── Cross-origin restrictions
3. JWT Tokens         ── Stateless authentication
4. Input Validation   ── Request validation
5. Error Handling     ── Secure error messages
6. Environment Vars   ── Sensitive data protection
```

## API Endpoints

```
Authentication:
  POST   /api/auth/register    ── Create new user
  POST   /api/auth/login       ── Login user
  GET    /api/auth/me          ── Get current user

Questions:
  GET    /api/questions        ── Get all questions
  GET    /api/questions/:id    ── Get question by ID
  POST   /api/questions        ── Create question (admin)
  PUT    /api/questions/:id    ── Update question (admin)
  DELETE /api/questions/:id    ── Delete question (admin)

Results:
  POST   /api/results          ── Submit test result
  GET    /api/results/user     ── Get user's results
  GET    /api/results/:id      ── Get result by ID
```

## Development Workflow

```
1. Create Model          ── Define data structure
2. Create Service        ── Write business logic
3. Create Controller     ── Handle HTTP requests
4. Create Route          ── Define endpoint
5. Write Tests           ── Unit & integration tests
6. Create Frontend API   ── API service methods
7. Create Component      ── UI component
8. Connect to Context    ── Global state if needed
9. Test End-to-End       ── Full user flow
```

## Best Practices Followed

✅ Separation of Concerns
✅ DRY (Don't Repeat Yourself)
✅ Error Handling at every layer
✅ Input Validation
✅ Security best practices
✅ Consistent naming conventions
✅ Code documentation
✅ Environment-based configuration
✅ Testing structure
✅ Path aliases for cleaner imports
