import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('medical');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'doctor' && email === 'doctor@gmail.com' && password === 'doctor@123') {
      navigate('/doctor-dashboard');
    } else if (role === 'medical' && email === 'medical@gmail.com' && password === 'medical@123') {
      navigate('/medical-dashboard');
    } else {
      alert('Invalid credentials or role.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="medical">Medical</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
