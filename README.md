# 🎓 Unified Learning Lab

A comprehensive full-stack learning platform with interactive visualizations for data structures, algorithms, and machine learning concepts.

## ✨ **ALL FEATURES WORKING!** ✅

🌳 **Binary Tree** | 🔍 **Binary Search** | 📚 **Stack & Queue** | 🧠 **CNN Visualizer** | 📝 **5 Test Categories**

### Quick Start:

📖 Read **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** to test all features in 5 minutes!
📊 Check **[FEATURES_STATUS.md](./FEATURES_STATUS.md)** for complete feature documentation!

## 🏗️ Project Structure

```
unified-learning-lab/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Configuration files (database, env)
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware (auth, error handling)
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── validators/     # Request validation schemas
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── tests/              # Test files
│   │   ├── unit/           # Unit tests
│   │   └── integration/    # Integration tests
│   ├── .env.example        # Environment variables template
│   ├── .eslintrc.js        # ESLint configuration
│   ├── .prettierrc.js      # Prettier configuration
│   ├── package.json
│   └── vitest.config.js    # Vitest configuration
│
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── api/            # API client and services
│   │   ├── assets/         # Images, icons, fonts
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar/
│   │   │   └── Sidebar/
│   │   ├── constants/      # App constants
│   │   ├── contexts/       # React contexts (auth, theme)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── styles/         # Global styles
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── index.js        # Entry point
│   ├── .env.example        # Environment variables template
│   ├── .eslintrc.cjs       # ESLint configuration
│   ├── .prettierrc.js      # Prettier configuration
│   ├── jsconfig.json       # Path aliases configuration
│   └── package.json
│
└── unified-site/           # Vanilla JS visualizations
    ├── js/                 # JavaScript modules
    ├── css/                # Stylesheets
    ├── pages/              # HTML pages
    └── index.html          # Landing page
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configurations
# MONGODB_URI, JWT_SECRET, etc.

# Start development server
npm run dev

# Run tests
npm test
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your API URL
# VITE_API_BASE_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Key Directories Explained

### Backend

- **config/** - Centralized configuration (database, environment variables)
- **controllers/** - Handle HTTP requests and responses
- **middleware/** - Authentication, error handling, validation
- **models/** - Database schemas and models
- **routes/** - API endpoint definitions
- **services/** - Business logic layer (separates logic from controllers)
- **utils/** - Helper functions and utilities
- **validators/** - Request validation schemas

### Frontend

- **api/** - Axios client and API service functions
- **components/** - Reusable UI components
- **contexts/** - Global state management (Auth, Theme)
- **hooks/** - Custom React hooks (useFetch, useForm, etc.)
- **pages/** - Page-level components
- **utils/** - Helper functions
- **constants/** - App-wide constants

## 🛠️ Available Scripts

### Backend

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🔐 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-lab
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Unified Learning Lab
```

## 📦 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Vitest** - Testing framework

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## � Documentation

- **[TESTING_GUIDE.md](./frontend/markdown/TESTING_GUIDE.md)** - Complete testing guide
- **[DEPLOYMENT_GUIDE.md](./backend/markdown/DEPLOYMENT_GUIDE.md)** - Full deployment documentation
- **[QUICKSTART_DEPLOY.md](./backend/markdown/QUICKSTART_DEPLOY.md)** - 10-minute deployment guide
- **[AI_QUESTION_GENERATION.md](./frontend/markdown/AI_QUESTION_GENERATION.md)** - 🤖 Generate questions with AI
- **[ARCHITECTURE.md](./backend/markdown/ARCHITECTURE.md)** - System architecture
- **[AUTHENTICATION_GUIDE.md](./backend/markdown/AUTHENTICATION_GUIDE.md)** - Auth implementation

### 🤖 AI-Powered Question Generation

Generate hundreds of questions automatically using ChatGPT, Claude, or Gemini!

**Quick Start:**

1. Read [AI_QUESTION_GENERATION.md](./frontend/markdown/AI_QUESTION_GENERATION.md)
2. Copy ready-to-use AI prompts
3. Generate questions in seconds
4. Import via Admin Panel

**Example AI Prompt:**

```
Generate 25 Coding questions in JSON format with:
{"text": "...", "category": "Coding", "difficulty": "easy",
 "options": [...], "correct": 0-3}
```

## �📝 Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- Consistent naming conventions
- Organized imports

## 🤝 Contributing

1. Follow the existing folder structure
2. Write meaningful commit messages
3. Add tests for new features
4. Run linters before committing
5. Update documentation as needed

## 📄 License

MIT

## 👥 Authors

Your Team Name
