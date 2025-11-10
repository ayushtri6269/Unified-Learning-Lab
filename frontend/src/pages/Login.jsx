import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';
import './Login.css';

function Login({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5001${endpoint}`, formData);

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        if (res.data.refreshToken) {
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        showSuccess(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      } else {
        showSuccess('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Validation errors
        setErrors(err.response.data.errors.map(e => e.message));
      } else if (err.response?.status === 423) {
        // Account locked
        setErrors(['Your account has been temporarily locked due to multiple failed login attempts. Please try again later.']);
      } else {
        setErrors([err.response?.data?.message || 'An error occurred']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isLogin ? '🎓 Login' : '📝 Register'}</h2>

        {errors.length > 0 && (
          <div className="error-container">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                <span className="error-icon">✗</span>
                {error}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {isLogin && (
            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}

          {!isLogin && (
            <div className="password-hint">
              <small>
                Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.
              </small>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p onClick={() => {
          setIsLogin(!isLogin);
          setErrors([]);
          setFormData({ name: '', email: '', password: '' });
        }} className="toggle-link">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </p>
      </div>
    </div>
  );
}

export default Login;
