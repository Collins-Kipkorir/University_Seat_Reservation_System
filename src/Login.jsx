import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  // 1. Create the "steering wheel" to change pages
  const navigate = useNavigate();

  // 2. Setup "State" to remember what the user types
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');

  // 3. This function runs when the blue button is clicked
  const handleLogin = (e) => {
    e.preventDefault(); // Prevents the page from refreshing/reloading
    
    // For now, we allow any ID/Password to work. 
    // Later, you can add: if(studentId === "admin") ...
    console.log("Logging in with:", studentId);
    
    // 4. Send the user to the Home page (the Figma code we are adding next)
    navigate('/home'); 
  };

  return (
    <div className="container">
      <div className="header">University Seat Reservation System</div>
      <h1>Log In</h1>

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
            placeholder="At least 8 characters" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn">Log In</button>
      </form>

      <div className="login-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>

      <div className="note">
        After log In, you can view available seats and make reservations.
      </div>
    </div>
  );
}

export default Login;