import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './Signup.css';
import { auth } from './api';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await auth.register({
        student_id: form.studentId,
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: form.role,
      });
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
      <h1>Sign Up</h1>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="studentId">Student / Staff ID</label>
          <input type="text" id="studentId" name="studentId" placeholder="e.g. STRATH/2023/1234" value={form.studentId} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="you@university.edu/.ac.ke/.ke" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="role">I am a:</label>
          <select id="role" name="role" value={form.role} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50">
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="login-link">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
