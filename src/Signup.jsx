import { Link } from 'react-router-dom';
import React from 'react';
import './Signup.css';

function Signup() {
  return (
    <div className="container">
      <div className="header">University Seat Reservation System</div>
      <h1>Sign Up</h1>

      <form>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" placeholder="John" required />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" placeholder="Doe" required />
        </div>

        <div className="form-group">
          <label htmlFor="studentId">Student / Staff ID</label>
          <input type="text" id="studentId" name="studentId" placeholder="e.g. STRATH/2023/1234" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="you@university.edu/.ac.ke/.ke" required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="At least 8 characters" required />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" required />
        </div>


        <button type="submit" className="btn">Sign Up</button>

        <div className="login-link">
            Already have an account? <Link to="/">Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;