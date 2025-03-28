import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (isSignUp) {
        if (password !== confirmPassword) {
          setPasswordError("Passwords don't match");
          return;
        }
        alert("Sign Up Successful"); // Replace with actual signup logic
      } else {
        alert("Login Successful"); // Replace with actual login logic
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <div className="login-container">
      <div className="auth-box">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span> Back to Home
        </Link>
        <h2 className="title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
        <p className="subtitle">
          {isSignUp 
            ? "Join our community of empowered women" 
            : "Sign in to access your safety features"}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          {isSignUp && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field ${passwordError ? "error" : ""}`}
                required
              />
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>
          )}
          
          {!isSignUp && (
            <div className="forgot-password">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
          )}
          
          <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              isSignUp ? "Create Account" : "Login"
            )}
          </button>
          
          <div className="form-footer">
            <p className="toggle-text">
              {isSignUp ? "Already have an account?" : "New to EmPower Her?"}
            </p>
            <button type="button" className="toggle-btn" onClick={toggleMode}>
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}