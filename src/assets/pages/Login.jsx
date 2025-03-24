import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider
} from "../../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (!email || !password) return;
    
    if (isSignUp && password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      }
    } catch (error) {
      setAuthError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setAuthError("");
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      setAuthError(getErrorMessage(error.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Email already in use. Please login instead.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/user-not-found":
        return "User not found. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/popup-closed-by-user":
        return "Google sign in was cancelled.";
      case "auth/account-exists-with-different-credential":
        return "An account already exists with the same email but different sign-in method.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setAuthError("");
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
        
        {authError && <p className="auth-error">{authError}</p>}
        
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
              minLength={6}
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
                minLength={6}
              />
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>
          )}
          
          {!isSignUp && (
            <div className="forgot-password">
              <Link to="/reset-password" className="forgot-link">Forgot password?</Link>
            </div>
          )}
          
          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? "loading" : ""}`} 
            disabled={isLoading || googleLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              isSignUp ? "Create Account" : "Login"
            )}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            className={`google-btn ${googleLoading ? "loading" : ""}`}
            onClick={handleGoogleSignIn}
            disabled={isLoading || googleLoading}
          >
            {googleLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isSignUp ? "Sign up with Google" : "Sign in with Google"}
              </>
            )}
          </button>
          
          <div className="form-footer">
            <p className="toggle-text">
              {isSignUp ? "Already have an account?" : "New to EmPower Her?"}
            </p>
            <button 
              type="button" 
              className="toggle-btn" 
              onClick={toggleMode}
              disabled={isLoading || googleLoading}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}