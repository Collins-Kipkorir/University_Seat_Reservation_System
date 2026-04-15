import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { auth } from './api';
import { PasswordChecklist } from './Components/PasswordChecklist';

function Login() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Show checklist only after the user first focuses the password field
  const [passwordTouched, setPasswordTouched] = useState(false);

  useEffect(() => {
    auth.me().then((data) => {
      if (data.authenticated) {
        navigate('/home');
      }
    }).catch(() => {});
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.login(studentId, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">University Seat Reservation System</div>
      <h1>Log In</h1>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="studentId">Student / Staff ID</label>
          <input
            type="text"
            id="studentId"
            placeholder="e.g. STRATH/2023/1234"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordTouched(true)}
            required
          />
          {/* Checklist is informational on login — it helps users recall the
              format without blocking submission or locking out existing accounts. */}
          <PasswordChecklist password={password} show={passwordTouched} />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="login-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>

      <div className="note">
        After log in, you can view available seats and make reservations.
      </div>
    </div>
  );
}

export default Login;
