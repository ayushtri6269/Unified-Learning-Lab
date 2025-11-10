import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AIChatSidebar from './components/AIChatSidebar';
import Home from './pages/Home';
import BinaryTree from './pages/BinaryTree';
import BST from './pages/BST';
import BinarySearch from './pages/BinarySearch';
import StackQueue from './pages/StackQueue';
import Stack from './pages/Stack';
import Queue from './pages/Queue';
import LinkedList from './pages/LinkedList';
import HashTable from './pages/HashTable';
import Heap from './pages/Heap';
import Trie from './pages/Trie';
import SegmentTree from './pages/SegmentTree';
import Graph from './pages/Graph';
import SortingVisualizer from './pages/SortingVisualizer';
import SearchingVisualizer from './pages/SearchingVisualizer';
import DynamicProgramming from './pages/DynamicProgramming';
import GreedyAlgorithms from './pages/GreedyAlgorithms';
import BoyerMoore from './pages/BoyerMoore';
import AptitudeTest from './pages/AptitudeTest';
import CNNVisualizer from './pages/CNNVisualizer';
import TypingSpeed from './pages/TypingSpeed';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AIAssistantButton from './components/AIAssistantButton';
import ShortcutOverlay from './components/ShortcutOverlay';
import './App.css';

const GLOBAL_SHORTCUT_SECTIONS = [
  {
    id: 'general-shortcuts',
    title: 'General',
    shortcuts: [
      {
        id: 'shortcut-help',
        keys: ['Shift', '/'],
        description: 'Show or hide this keyboard shortcut guide',
      },
      {
        id: 'shortcut-help-close',
        keys: ['Esc'],
        description: 'Close the keyboard shortcut guide',
      },
    ],
  },
  {
    id: 'ai-shortcuts',
    title: 'AI Assistant',
    shortcuts: [
      {
        id: 'ai-toggle',
        keys: ['Ctrl / Cmd', 'Shift', 'A'],
        description: 'Open or close the AI assistant sidebar',
      },
      {
        id: 'ai-send-message',
        keys: ['Ctrl / Cmd', 'Enter'],
        description: 'Send your message in the AI assistant sidebar',
      },
      {
        id: 'ai-new-line',
        keys: ['Enter'],
        description: 'Insert a new line while composing an AI assistant message',
      },
    ],
  },
];

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAiChat = () => {
    setAiChatOpen(!aiChatOpen);
  };

  useEffect(() => {
    const handleGlobalKeydown = (event) => {
      const target = event.target;
      const tagName = target?.tagName;
      const isEditable = target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName);
      const isShortcutCombo = event.key === '?' || (event.key === '/' && event.shiftKey);
      const isAiToggleCombo =
        event.shiftKey &&
        (event.ctrlKey || event.metaKey) &&
        typeof event.key === 'string' &&
        event.key.toLowerCase() === 'a';

      if (isAiToggleCombo) {
        event.preventDefault();
        setAiChatOpen((prev) => !prev);
        return;
      }

      if (isShortcutCombo && !isEditable) {
        event.preventDefault();
        setShowShortcuts((prev) => !prev);
        return;
      }

      if (event.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="app">
            <Navbar
              user={user}
              onLogout={handleLogout}
              toggleSidebar={toggleSidebar}
              toggleAiChat={toggleAiChat}
            />
            <div className="main-container">
              {user && (
                <Sidebar user={user} className={sidebarOpen ? '' : 'collapsed'} />
              )}
              <div className={`content ${!user || !sidebarOpen ? 'full-width' : ''}`}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login setUser={setUser} />} />
                  <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                  <Route path="/admin" element={user && user.role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
                  <Route path="/binary-tree" element={<BinaryTree />} />
                  <Route path="/bst" element={<BST />} />
                  <Route path="/binary-search" element={<BinarySearch />} />
                  <Route path="/stack-queue" element={<StackQueue />} />
                  <Route path="/stack" element={<Stack />} />
                  <Route path="/queue" element={<Queue />} />
                  <Route path="/linked-list" element={<LinkedList />} />
                  <Route path="/hash-table" element={<HashTable />} />
                  <Route path="/heap" element={<Heap />} />
                  <Route path="/trie" element={<Trie />} />
                  <Route path="/segment-tree" element={<SegmentTree />} />
                  <Route path="/graph" element={<Graph />} />
                  <Route path="/sorting" element={<SortingVisualizer />} />
                  <Route path="/searching" element={<SearchingVisualizer />} />
                  <Route path="/dynamic-programming" element={<DynamicProgramming />} />
                  <Route path="/greedy-algorithms" element={<GreedyAlgorithms />} />
                  <Route path="/boyer-moore" element={<BoyerMoore />} />
                  <Route path="/aptitude/:category" element={<AptitudeTest user={user} />} />
                  <Route path="/cnn" element={<CNNVisualizer />} />
                  <Route path="/typing-speed" element={<TypingSpeed />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
              </div>
            </div>
            <AIChatSidebar isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} />
            <ShortcutOverlay
              isOpen={showShortcuts}
              onClose={() => setShowShortcuts(false)}
              sections={GLOBAL_SHORTCUT_SECTIONS}
            />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
