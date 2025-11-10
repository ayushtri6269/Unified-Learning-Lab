# 🚀 Quick Start & Testing Guide

## Start the Application

### Terminal 1 - Backend

```powershell
cd backend
npm run dev
```

✅ Backend should start on `http://localhost:5000`

### Terminal 2 - Frontend

```powershell
cd frontend
npm start
```

✅ Frontend should open at `http://localhost:3000`

---

## 🧪 Test All Features (5 Minutes)

### 1️⃣ Test Binary Tree (30 seconds)

1. Click **"Binary Tree"** in navbar
2. Type: `50` → Click Insert
3. Type: `30` → Click Insert
4. Type: `70` → Click Insert
5. Type: `20` → Click Insert
6. Type: `80` → Click Insert

**Expected**: See tree structure building with connected nodes

---

### 2️⃣ Test Binary Search (30 seconds)

1. Click **"Binary Search"** in navbar
2. Click **"Generate Array"** (array appears)
3. Enter **15** in "Target" field
4. Click **"Search"** button
5. Click **"Next"** to step through

**Expected**: See low/mid/high pointers moving through array

---

### 3️⃣ Test Stack & Queue (30 seconds)

1. Click **"Stack & Queue"** in navbar

**Stack Side:**

- Enter: `Apple` → Push
- Enter: `Banana` → Push
- Enter: `Cherry` → Push
- Click **Pop** → Cherry disappears (LIFO)

**Queue Side:**

- Enter: `Red` → Enqueue
- Enter: `Green` → Enqueue
- Enter: `Blue` → Enqueue
- Click **Dequeue** → Red disappears (FIFO)

**Expected**: Stack removes from top, Queue removes from front

---

### 4️⃣ Test CNN Visualizer (1 minute)

1. Click **"CNN Visualizer"** in navbar
2. Image: Keep `5 x 5` → Click **"Create"**
3. Fill first row: `1 2 3 4 5`
4. Filter: Keep `3 x 3` → Click **"Create"**
5. Fill filter with: `1 0 -1 / 1 0 -1 / 1 0 -1`
6. Click **"Compute Convolution"**

**Expected**: See feature map output below

---

### 5️⃣ Test Navigation (30 seconds)

1. Click **Dashboard** (sidebar) → Opens dashboard
2. Click **Binary Tree** (sidebar) → Tree page
3. Click **Binary Search** (navbar) → Search page
4. Click **Stack & Queue** (navbar) → Stack/Queue page
5. Notice **active link highlighting** (purple background)

**Expected**: Smooth navigation, active page highlighted

---

### 6️⃣ Test Responsive Design (30 seconds)

1. Resize browser window → Make it narrow
2. See **hamburger menu** (☰) appear in navbar
3. Click hamburger → Menu opens/closes
4. Try on mobile device or dev tools mobile view

**Expected**: Mobile-friendly responsive layout

---

### 7️⃣ Test Sidebar Toggle (15 seconds)

1. Click **☰** button (top-left of navbar)
2. Sidebar disappears
3. Click again → Sidebar reappears
4. Content expands when sidebar hidden

**Expected**: Sidebar smoothly hides/shows

---

## 🔐 Test Authentication (Optional)

### If you have database setup:

1. Click **"Login"** in navbar
2. Register new account:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click **Register** → Auto login
4. Now access **Tests** in sidebar:
   - Aptitude Test
   - Coding Test
   - DBMS Test
   - OS Test
   - Networks Test

**Note**: Tests require backend database with questions

---

## ✅ Success Checklist

After testing, you should see:

- [x] Binary Tree builds visually
- [x] Binary Search steps through algorithm
- [x] Stack pushes/pops correctly (LIFO)
- [x] Queue enqueues/dequeues correctly (FIFO)
- [x] CNN computes convolution
- [x] Navigation works (navbar + sidebar)
- [x] Active links highlighted
- [x] Sidebar toggles on/off
- [x] Responsive on mobile
- [x] All pages load without errors

---

## 🐛 Troubleshooting

### Backend won't start?

```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed (replace PID)
taskkill /PID <PID> /F

# Reinstall dependencies
cd backend
rm -r node_modules
npm install
npm run dev
```

### Frontend won't start?

```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F

# Reinstall dependencies
cd frontend
rm -r node_modules
npm install
npm start
```

### Features not visible?

1. Check browser console (F12) for errors
2. Ensure both servers are running
3. Hard refresh: `Ctrl + Shift + R`
4. Clear browser cache

### Navigation broken?

1. Check if React Router installed: `npm list react-router-dom`
2. If not: `npm install react-router-dom`

---

## 📸 Expected Screenshots

### Binary Tree

- Canvas with blue circles (nodes)
- Lines connecting parent-child
- Numbers inside circles

### Binary Search

- Horizontal array of boxes
- Color-coded boxes (blue/green/red)
- Step counter below

### Stack & Queue

- Two vertical/horizontal containers
- Items stacked/queued
- Clear size indicators

### CNN

- Two input matrices (editable)
- Compute button
- Feature map output text

---

## 🎯 Performance Test

All features should:

- Load in **< 1 second**
- Respond to clicks **instantly**
- Render animations **smoothly**
- Navigate between pages **without lag**

---

## 🎉 All Features Working!

If you see all the above working, **congratulations!** 🚀

Your learning platform is **fully functional** with:

- ✅ Data structure visualizations
- ✅ Algorithm step-through
- ✅ Machine learning demos
- ✅ Modern UI/UX
- ✅ Responsive design
- ✅ Professional navigation

**Enjoy exploring and learning!** 🎓

---

**Testing Time**: ~5-10 minutes
**Last Updated**: October 27, 2025
