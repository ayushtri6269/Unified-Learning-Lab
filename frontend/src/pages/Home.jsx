import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const dataStructures = [
    {
      title: 'Binary Tree',
      desc: 'Visualize tree structure and node insertion with real-time canvas rendering',
      path: '/binary-tree',
      icon: '🌳',
      color: '#10b981'
    },
    {
      title: 'Binary Search Tree',
      desc: 'Ordered binary tree with efficient search, insert, delete operations and traversals',
      path: '/bst',
      icon: '🌲',
      color: '#2e7d32'
    },
    {
      title: 'Stack',
      desc: 'Explore LIFO (Last In First Out) data structure with push, pop operations',
      path: '/stack',
      icon: '📚',
      color: '#8b5cf6'
    },
    {
      title: 'Queue',
      desc: 'Visualize FIFO (First In First Out) operations and real-world applications',
      path: '/queue',
      icon: '🎫',
      color: '#06b6d4'
    },
    {
      title: 'Linked List',
      desc: 'Dynamic data structure with insert, delete, and search operations',
      path: '/linked-list',
      icon: '🔗',
      color: '#f59e0b'
    },
    {
      title: 'Hash Table',
      desc: 'Key-value storage with O(1) lookup using hash functions and collision handling',
      path: '/hash-table',
      icon: '🗂️',
      color: '#10b981'
    },
    {
      title: 'Heap',
      desc: 'Min/Max heap with priority queue operations and heapify algorithms',
      path: '/heap',
      icon: '🔺',
      color: '#ec4899'
    },
    {
      title: 'Trie',
      desc: 'Prefix tree for efficient string search, autocomplete, and dictionary operations',
      path: '/trie',
      icon: '🔤',
      color: '#9c27b0'
    },
    {
      title: 'Segment Tree',
      desc: 'Range query data structure supporting sum, min, max operations with O(log n) complexity',
      path: '/segment-tree',
      icon: '🌳',
      color: '#ff5722'
    },
    {
      title: 'Graph',
      desc: 'Directed/Undirected graphs with BFS, DFS traversal and weighted edges',
      path: '/graph',
      icon: '🌐',
      color: '#3b82f6'
    }
  ];

  const algorithms = [
    {
      title: 'Sorting Algorithms',
      desc: 'Visual comparison of Bubble, Selection, Insertion, Merge, Quick, and Heap Sort',
      path: '/sorting',
      icon: '📊',
      color: '#9b59b6'
    },
    {
      title: 'Searching Algorithms',
      desc: 'Explore Linear, Binary, Jump, Interpolation, Exponential, and Fibonacci Search',
      path: '/searching',
      icon: '🔍',
      color: '#26a69a'
    },
    {
      title: 'Dynamic Programming',
      desc: 'Solve complex problems: Fibonacci, LCS, Knapsack, Coin Change with step-by-step visualization',
      path: '/dynamic-programming',
      icon: '🎯',
      color: '#3f51b5'
    },
    {
      title: 'Greedy Algorithms',
      desc: 'Make locally optimal choices: Activity Selection, Fractional Knapsack, Huffman Coding',
      path: '/greedy-algorithms',
      icon: '💚',
      color: '#2e7d32'
    },
    {
      title: 'Boyer-Moore Algorithm',
      desc: 'Efficient string matching with bad character and good suffix heuristics for pattern searching',
      path: '/boyer-moore',
      icon: '🔤',
      color: '#e91e63'
    }
  ];

  const artificialIntelligenceModules = [
    {
      title: 'CNN Visualizer',
      desc: 'Understand 2D convolution with custom matrices and filters',
      path: '/cnn',
      icon: '🧠',
      color: '#ec4899'
    }
  ];

  const tests = [
    {
      title: 'Aptitude Test',
      desc: 'Sharpen your logical reasoning and problem-solving skills',
      path: '/aptitude/Aptitude',
      icon: '🧮',
      color: '#f59e0b'
    },
    {
      title: 'Coding Test',
      desc: 'Practice programming challenges and algorithms',
      path: '/aptitude/Coding',
      icon: '💻',
      color: '#06b6d4'
    },
    {
      title: 'DBMS Test',
      desc: 'Master database concepts and SQL queries',
      path: '/aptitude/DBMS',
      icon: '🗄️',
      color: '#14b8a6'
    },
    {
      title: 'OS Test',
      desc: 'Learn operating system fundamentals and concepts',
      path: '/aptitude/OS',
      icon: '⚙️',
      color: '#64748b'
    },
    {
      title: 'Networks Test',
      desc: 'Understand networking protocols and architecture',
      path: '/aptitude/Networks',
      icon: '🌐',
      color: '#6366f1'
    }
  ];

  const stats = [
    { label: 'Interactive Modules', value: '15+', icon: '📚' },
    { label: 'Data Structures', value: '6', icon: '🌳' },
    { label: 'Algorithms', value: '12', icon: '📊' },
    { label: 'Learning Paths', value: '4', icon: '🎯' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Computer Science
            <span className="gradient-text"> Interactively</span>
          </h1>
          <p className="hero-subtitle">
            Learn data structures, algorithms, and computer science fundamentals through
            interactive visualizations and hands-on practice
          </p>
          <div className="hero-buttons">
            <Link to="/binary-tree" className="btn btn-primary-large">
              🚀 Start Learning
            </Link>
            <Link to="/dashboard" className="btn btn-secondary-large">
              📊 View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Structures Section */}
      <section className="section middle-section">
        <div className="section-header">
          <h2 className="section-title">🌳 Data Structures</h2>
          <p className="section-subtitle">Visualize and understand core data structures</p>
        </div>
        <div className="modules-grid">
          {dataStructures.map((module, idx) => (
            <Link to={module.path} key={idx} className="module-card" style={{'--card-color': module.color, '--card-index': idx}}>
              <div className="card-icon">{module.icon}</div>
              <h3 className="card-title">{module.title}</h3>
              <p className="card-desc">{module.desc}</p>
              <div className="card-footer">
                <span className="card-link">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="section middle-section">
        <div className="section-header">
          <h2 className="section-title">📊 Algorithms</h2>
          <p className="section-subtitle">Visualize sorting and searching algorithms in action</p>
        </div>
        <div className="modules-grid">
          {algorithms.map((module, idx) => (
            <Link to={module.path} key={idx} className="module-card featured" style={{'--card-color': module.color, '--card-index': idx}}>
              <div className="featured-badge">New</div>
              <div className="card-icon">{module.icon}</div>
              <h3 className="card-title">{module.title}</h3>
              <p className="card-desc">{module.desc}</p>
              <div className="card-footer">
                <span className="card-link">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Artificial Intelligence Section */}
      <section className="section middle-section">
        <div className="section-header">
          <h2 className="section-title">🧠 Artificial Intelligence</h2>
          <p className="section-subtitle">Understand neural network concepts visually</p>
        </div>
        <div className="modules-grid">
          {artificialIntelligenceModules.map((module, idx) => (
            <Link to={module.path} key={idx} className="module-card featured" style={{'--card-color': module.color, '--card-index': idx}}>
              <div className="featured-badge">Popular</div>
              <div className="card-icon">{module.icon}</div>
              <h3 className="card-title">{module.title}</h3>
              <p className="card-desc">{module.desc}</p>
              <div className="card-footer">
                <span className="card-link">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="section middle-section">
        <div className="section-header">
          <h2 className="section-title">⌨️ Skill Development</h2>
          <p className="section-subtitle">Practice and improve essential technical skills</p>
        </div>
        <div className="modules-grid">
          <Link to="/typing-speed" className="module-card featured" style={{'--card-color': '#66bb6a', '--card-index': 0}}>
            <div className="featured-badge">New</div>
            <div className="card-icon">⌨️</div>
            <h3 className="card-title">Typing Speed Test</h3>
            <p className="card-desc">Improve your typing speed and accuracy with interactive keyboard practice</p>
            <div className="card-footer">
              <span className="card-link">Start Practicing →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Tests Section */}
      <section className="section lower-section">
        <div className="section-header">
          <h2 className="section-title">📝 Practice Tests</h2>
          <p className="section-subtitle">Test your knowledge and track progress</p>
        </div>
        <div className="modules-grid">
          {tests.map((module, idx) => (
            <Link to={module.path} key={idx} className="module-card" style={{'--card-color': module.color, '--card-index': idx}}>
              <div className="card-icon">{module.icon}</div>
              <h3 className="card-title">{module.title}</h3>
              <p className="card-desc">{module.desc}</p>
              <div className="card-footer">
                <span className="card-link">Start Test →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Learning Lab?</h2>
        <div className="features-grid">
          <div className="feature-card" style={{'--feature-index': 0}}>
            <div className="feature-icon">✨</div>
            <h3>Interactive Learning</h3>
            <p>Hands-on visualizations make complex concepts easy to understand</p>
          </div>
          <div className="feature-card" style={{'--feature-index': 1}}>
            <div className="feature-icon">🎯</div>
            <h3>Step-by-Step</h3>
            <p>Follow algorithms execution step by step with detailed explanations</p>
          </div>
          <div className="feature-card" style={{'--feature-index': 2}}>
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed analytics and scores</p>
          </div>
          <div className="feature-card" style={{'--feature-index': 3}}>
            <div className="feature-icon">🚀</div>
            <h3>Self-Paced</h3>
            <p>Learn at your own pace with unlimited practice opportunities</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
