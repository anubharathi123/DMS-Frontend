import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import authService from '../../ApiServices/ApiServices';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!username || !password) {
        setMessages(['Please fill in all fields']);
        return;
      }

      // Call login API
      const loginResponse = await authService.login({ username, password });
      setIsLoginSuccessful(true);
      setMessages([]);
      console.log('Login successful:', loginResponse);

      // Send OTP after successful login
      const otpResponse = await authService.sendOTP(username);
      console.log('OTP sent successfully:', otpResponse);

      // Show OTP input field
      setIsOtpVisible(true);
    } catch (error) {
      console.error('Login error:', error.message || error);
      setIsLoginSuccessful(false);
      setMessages([error.message || 'Login failed']);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!otp) {
        setMessages(['Please enter the OTP']);
        return;
      }

      // Call verify OTP API
      const verifyResponse = await authService.verifyOTP({ email: username, otp });
      setIsOtpVerified(true);
      setMessages([]);
      console.log('OTP verification successful:', verifyResponse);
      localStorage.setItem("access_status","true")
      CON
      navigate("/dashboard");  // Redirect to the home page after successful OTP verification
      alert('OTP Verified!');
    } catch (error) {
      console.error('OTP verification error:', error.message || error);
      setMessages([error.message || 'Invalid OTP. Please try again.']);
      setIsOtpVerified(false);
    }
  };

  return (
    <div className="login-container">
      {/* Show login success or failure message at the top */}
      {isLoginSuccessful && !isOtpVerified && (
        <div className="login-status success">
          <p>Welcome User! Please verify the OTP.</p>
        </div>
      )}

      {/* Show messages for other errors */}
      {messages.length > 0 && (
        <div className="messages">
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Login Form */}
      <h1>Login</h1>
      <form onSubmit={isOtpVisible ? handleOtpSubmit : handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="username">
            Username/Email Id <span className="required">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isOtpVisible} // Disable if OTP field is visible
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isOtpVisible} // Disable if OTP field is visible
          />
        </div>

        {/* Forgot Password link */}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        {/* OTP input only shows when login is successful */}
        {isOtpVisible && (
          <div className="form-group">
            <label htmlFor="otp">
              OTP <span className="required">*</span>
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit">{isOtpVisible ? 'Verify OTP' : 'Login'}</button>
      </form>
    </div>
  );
};

export default Login;
