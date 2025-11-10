import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AptitudeTest.css';

function AptitudeTest({ user }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visited, setVisited] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/questions/${category}`)
      .then(res => {
        console.log('API Response:', res.data);
        // API returns { success: true, count: X, data: [...] }
        const questionsData = res.data.data || res.data;
        setQuestions(questionsData);
        setLoading(false);
        // Mark first question as visited
        if (questionsData.length > 0) {
          setVisited({ [questionsData[0]._id]: true });
        }
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, [category]);

  // Mark question as visited when index changes
  useEffect(() => {
    if (questions[currentIndex]) {
      setVisited(prev => ({ ...prev, [questions[currentIndex]._id]: true }));
    }
  }, [currentIndex, questions]);

  // Timer countdown
  useEffect(() => {
    if (!testStarted) return; // Don't start timer until test starts

    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, testStarted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 300) return 'timer-critical'; // Last 5 minutes
    if (timeRemaining <= 600) return 'timer-warning'; // Last 10 minutes
    return 'timer-normal';
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleMarkForReview = () => {
    const questionId = questions[currentIndex]._id;
    setMarkedForReview({ ...markedForReview, [questionId]: !markedForReview[questionId] });
  };

  const handleClearResponse = () => {
    const questionId = questions[currentIndex]._id;
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getQuestionStatus = (q) => {
    const isAnswered = answers[q._id] !== undefined;
    const isMarked = markedForReview[q._id];
    const isVisited = visited[q._id];
    const isCurrent = questions[currentIndex]?._id === q._id;

    if (isCurrent) return 'current';
    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    if (isVisited) return 'visited';
    return 'not-visited';
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    let totalAnswered = Object.keys(answers).length;

    questions.forEach(q => {
      if (answers[q._id] === q.correct) {
        correctCount++;
      }
    });

    const percentage = totalAnswered > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    // Prepare result data
    const resultData = {
      category: category,
      score: correctCount,
      total: questions.length,
      percentage: percentage,
      answers: answers,
      timeTaken: (30 * 60) - timeRemaining, // Time taken in seconds
    };

    // Get token
    const token = localStorage.getItem('token');

    // Submit to backend
    axios.post('http://localhost:5001/api/results', resultData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        console.log('Result submitted:', res.data);
        setResult({
          score: correctCount,
          total: questions.length,
          percentage: percentage,
          correctAnswers: correctCount,
          wrongAnswers: totalAnswered - correctCount,
          unattempted: questions.length - totalAnswered
        });
      })
      .catch(err => {
        console.error('Error submitting result:', err);
        // Still show result even if save fails
        setResult({
          score: correctCount,
          total: questions.length,
          percentage: percentage,
          correctAnswers: correctCount,
          wrongAnswers: totalAnswered - correctCount,
          unattempted: questions.length - totalAnswered
        });
      });
  };

  if (loading) return <div className="loading">Loading questions...</div>;

  // Instructions Screen
  if (!testStarted && !result) {
    return (
      <div className="instructions-container">
        <div className="instructions-card">
          <h1 className="instructions-title">📋 {category} Test Instructions</h1>

          <div className="instructions-content">
            <div className="instruction-section">
              <h3>⏱️ Time Duration</h3>
              <p>You have <strong>30 minutes</strong> to complete this test.</p>
              <p className="info-text">Timer will start as soon as you click "Start Test"</p>
            </div>

            <div className="instruction-section">
              <h3>📝 Test Format</h3>
              <p>Total Questions: <strong>{questions.length}</strong></p>
              <p>All questions are multiple choice with 4 options</p>
            </div>

            <div className="instruction-section">
              <h3>✅ Navigation & Controls</h3>
              <ul>
                <li><strong>Question Palette:</strong> Click any question number to jump directly</li>
                <li><strong>Previous/Next:</strong> Navigate sequentially through questions</li>
                <li><strong>Mark for Review:</strong> Flag questions to revisit later</li>
                <li><strong>Clear:</strong> Remove your selected answer</li>
                <li><strong>Save:</strong> Save your answer without navigating</li>
              </ul>
            </div>

            <div className="instruction-section">
              <h3>🎨 Question Status Colors</h3>
              <div className="status-examples">
                <div className="status-example">
                  <span className="status-box not-visited-box"></span>
                  <span>Not Visited</span>
                </div>
                <div className="status-example">
                  <span className="status-box visited-box"></span>
                  <span>Visited (Not Answered)</span>
                </div>
                <div className="status-example">
                  <span className="status-box answered-box"></span>
                  <span>Answered</span>
                </div>
                <div className="status-example">
                  <span className="status-box marked-box"></span>
                  <span>Marked for Review</span>
                </div>
                <div className="status-example">
                  <span className="status-box answered-marked-box"></span>
                  <span>Answered & Marked</span>
                </div>
              </div>
            </div>

            <div className="instruction-section warning">
              <h3>⚠️ Important Notes</h3>
              <ul>
                <li>You can switch between questions anytime before submitting</li>
                <li>Test will <strong>auto-submit</strong> when time expires</li>
                <li>You can submit early using the "Submit Test" button</li>
                <li>Once submitted, you cannot change your answers</li>
                <li><strong>Full screen mode</strong> is recommended for better experience</li>
              </ul>
            </div>
          </div>

          <div className="instructions-actions">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-cancel"
            >
              ← Cancel
            </button>
            <button
              onClick={() => setTestStarted(true)}
              className="btn btn-start"
            >
              🚀 Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2>🎉 Test Completed!</h2>
          <div className="score-summary">
            <div className="score-circle">
              <div className="score-value">{result.percentage}%</div>
              <div className="score-label">Score</div>
            </div>
            <div className="score-details">
              <div className="score-item correct">
                <span className="icon">✅</span>
                <span className="label">Correct</span>
                <span className="value">{result.correctAnswers || result.score}</span>
              </div>
              <div className="score-item wrong">
                <span className="icon">❌</span>
                <span className="label">Wrong</span>
                <span className="value">{result.wrongAnswers || 0}</span>
              </div>
              <div className="score-item unattempted">
                <span className="icon">⭕</span>
                <span className="label">Unattempted</span>
                <span className="value">{result.unattempted || (result.total - result.score)}</span>
              </div>
              <div className="score-item total">
                <span className="icon">📊</span>
                <span className="label">Total</span>
                <span className="value">{result.total}</span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Back to Dashboard</button>
        </div>

        {/* Questions Review */}
        <div className="questions-review">
          <h3>📝 Questions Review</h3>
          {questions.map((q, idx) => {
            const userAnswer = answers[q._id];
            const isCorrect = userAnswer === q.correct;
            const isUnattempted = userAnswer === undefined;

            return (
              <div key={q._id} className={`review-question ${isCorrect ? 'correct' : isUnattempted ? 'unattempted' : 'wrong'}`}>
                <div className="review-header">
                  <div className="review-number">Q{idx + 1}</div>
                  <div className="review-status">
                    {isCorrect ? '✅ Correct' : isUnattempted ? '⭕ Unattempted' : '❌ Wrong'}
                  </div>
                </div>
                <div className="review-question-text">{q.text}</div>
                <div className="review-options">
                  {q.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`review-option ${
                        optIdx === q.correct ? 'correct-answer' : ''
                      } ${
                        optIdx === userAnswer && optIdx !== q.correct ? 'wrong-answer' : ''
                      } ${
                        optIdx === userAnswer && optIdx === q.correct ? 'user-correct' : ''
                      }`}
                    >
                      <span className="option-label">{String.fromCharCode(65 + optIdx)}.</span>
                      <span className="option-text">{option}</span>
                      {optIdx === q.correct && <span className="badge correct-badge">✓ Correct Answer</span>}
                      {optIdx === userAnswer && optIdx !== q.correct && <span className="badge wrong-badge">Your Answer</span>}
                      {optIdx === userAnswer && optIdx === q.correct && <span className="badge correct-badge">Your Answer</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  if (!question) return <div>No questions available</div>;

  return (
    <div className="aptitude-test">
      <div className="test-header">
        <h2>{category} Test</h2>

        <div className="header-controls">
          <div className={`timer-display ${getTimerColor()}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(timeRemaining)}</span>
          </div>
          <button onClick={handleSubmit} className="btn btn-submit-header">
            ✅ Submit Test
          </button>
        </div>
      </div>

      <div className="test-layout">
        {/* Main Content Area */}
        <div className="test-content">
          <div className="progress">Question {currentIndex + 1} of {questions.length}</div>

          <div className="question-card">
            <div className="question-header">
              <div className="question-number">{currentIndex + 1}</div>
              <h3>{question.text}</h3>
            </div>
            <div className="options">
              {question.options.map((option, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={question._id}
                    checked={answers[question._id] === idx}
                    onChange={() => handleAnswer(question._id, idx)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="navigation">
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
            >
              ⬅️ Previous
            </button>

            <button
              onClick={handleMarkForReview}
              className={`btn ${markedForReview[question._id] ? 'btn-warning-active' : 'btn-warning'}`}
            >
              {markedForReview[question._id] ? '⭐ Marked' : '🔖 Mark for Review'}
            </button>

            <button
              onClick={handleClearResponse}
              className="btn btn-danger"
              disabled={answers[question._id] === undefined}
            >
              🗑️ Clear
            </button>

            <button
              onClick={() => {/* Just save, don't navigate */}}
              className="btn btn-info"
            >
              💾 Save
            </button>

            {currentIndex < questions.length - 1 ? (
              <button onClick={handleSaveAndNext} className="btn btn-success">
                Next ➡️
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn btn-submit">
                ✅ Submit Test
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="test-sidebar">
          <h3>Question Palette</h3>

          {/* Question Numbers Navigation Bar */}
          <div className="question-nav-bar">
            {questions.slice(0, 25).map((q, idx) => (
              <button
                key={idx}
                className={`question-nav-btn ${getQuestionStatus(q)}`}
                onClick={() => setCurrentIndex(idx)}
                title={
                  answers[q._id] !== undefined && markedForReview[q._id] ? 'Answered & Marked for Review' :
                  answers[q._id] !== undefined ? 'Answered' :
                  markedForReview[q._id] ? 'Marked for Review' :
                  visited[q._id] ? 'Visited' :
                  'Not Visited'
                }
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="status-legend">
            <h4>Status Guide</h4>
            <div className="legend-item">
              <span className="legend-box not-visited"></span>
              <span>Not Visited</span>
            </div>
            <div className="legend-item">
              <span className="legend-box visited"></span>
              <span>Visited</span>
            </div>
            <div className="legend-item">
              <span className="legend-box answered"></span>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <span className="legend-box marked"></span>
              <span>Marked</span>
            </div>
            <div className="legend-item">
              <span className="legend-box answered-marked"></span>
              <span>Answered & Marked</span>
            </div>
            <div className="legend-item">
              <span className="legend-box current"></span>
              <span>Current</span>
            </div>
          </div>

          {/* Summary */}
          <div className="test-summary">
            <h4>Summary</h4>
            <div className="summary-item">
              <span>Answered:</span>
              <strong>{Object.keys(answers).length}</strong>
            </div>
            <div className="summary-item">
              <span>Not Answered:</span>
              <strong>{questions.length - Object.keys(answers).length}</strong>
            </div>
            <div className="summary-item">
              <span>Marked:</span>
              <strong>{Object.keys(markedForReview).filter(k => markedForReview[k]).length}</strong>
            </div>
            <div className="summary-item">
              <span>Not Visited:</span>
              <strong>{questions.length - Object.keys(visited).length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AptitudeTest;
