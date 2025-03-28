import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./assets/pages/Login";
import FeaturesPage from "./assets/pages/FeaturesPage";
import { auth, signOut } from "./firebase";
import "./App.css";
import "./assets/pages/FeaturesPage.css";
import Sos from "./assets/pages/Sos";
import MapOperationsPage from "./assets/pages/Map";
import CommunityPage from "./assets/pages/CommunityPage";
import Chatbot from "./assets/pages/Chatbot";
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function HomePage({ features, activeFeature, setActiveFeature, user, handleLogout, isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation */}
      <header>
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <span className="logo-text">EmPower Her</span>
            </div>

            <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <li><Link to="/features" onClick={() => setIsMenuOpen(false)}>Features</Link></li>
              <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
              <li><a href="#download" onClick={() => setIsMenuOpen(false)}>Download</a></li>
              <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
            </ul>

            <div className="cta-buttons">
              {user ? (
                <div className="user-profile">
                  <div className="profile-dropdown">
                    <span className="profile-name">
                      {user.displayName || user.email.split('@')[0]}
                      {user.photoURL && (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="profile-pic"
                        />
                      )}
                    </span>
                    <div className="dropdown-content">
                      <button onClick={handleLogout} className="dropdown-item">Logout</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login"><button className="btn btn-outline">Log in</button></Link>
              )}
              <button className="btn btn-primary">Download</button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="title">Safety First, Always</h1>
              <p className="subtitle">Empowering women with smart technology for safer mobility and peace of mind.</p>
              <div className="hero-buttons">
                <button onClick={() => navigate('/features')} className="btn btn-primary">Get Started</button>
                <button className="btn btn-outline">Learn More</button>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-illustration">
                <div className="illustration-element safety-shield"></div>
                <div className="illustration-element location-pin"></div>
                <div className="illustration-element protection-circle"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Preview Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Comprehensive Safety Features</h2>
            <p>Our AI-powered solution provides multiple layers of protection to ensure women travel safely.</p>
          </div>
          
          <div className="features-showcase">
            <div className="features-list">
              {features.slice(0, 4).map((feature, index) => (
                <div 
                  key={index} 
                  className={`feature-item ${activeFeature === index ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="feature-visual">
              <div className="visual-container">
                <div className="feature-animation">
                  {activeFeature === 0 && <div className="animation route-monitor"></div>}
                  {activeFeature === 1 && <div className="animation threat-detect"></div>}
                  {activeFeature === 2 && <div className="animation hotspot-map"></div>}
                  {activeFeature === 3 && <div className="animation emergency-call"></div>}
                </div>
              </div>
            </div>
          </div>
          <div className="view-all-features">
            <button onClick={() => navigate('/features')} className="btn btn-outline">View All Features</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <div className="image-container">
                <div className="image-effect"></div>
              </div>
            </div>
            <div className="about-text">
              <h2>Why Choose EmPower Her?</h2>
              <p>We're committed to creating a safer world for women through innovative technology and community support.</p>
              <div className="stats">
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Cities</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="download">
        <div className="container">
          <h2>Download EmPower Her Today</h2>
          <p>Take control of your safety with our comprehensive protection app.</p>
          <div className="download-buttons">
            <button className="btn-download">
              <div className="btn-icon"></div>
              <div className="btn-text">
                <span className="small-text">Get it on</span>
                <span className="large-text">App Store</span>
              </div>
            </button>
            <button className="btn-download">
              <div className="btn-icon"></div>
              <div className="btn-text">
                <span className="small-text">Download on</span>
                <span className="large-text">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-text">EmPower Her</div>
              <p>Safety through technology</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h3>Product</h3>
                <ul>
                  <li><button onClick={() => navigate('/features')}>Features</button></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#download">Download</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h3>Company</h3>
                <ul>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#careers">Careers</a></li>
                </ul>
              </div>
              <div className="link-group">
                <h3>Connect</h3>
                <div className="social-links">
                  <a href="#" className="social-icon"></a>
                  <a href="#" className="social-icon"></a>
                  <a href="#" className="social-icon"></a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 EmPower Her. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [user, setUser] = useState(null);

  const features = [
    { 
      title: "Route Monitoring", 
      description: "Track your route in real time.",
      details: "Our advanced GPS tracking provides real-time route monitoring with predictive analysis of potential risks along your path."
    },
    { 
      title: "Threat Detection", 
      description: "AI-powered safety alerts.",
      details: "Machine learning algorithms analyze environmental factors and user reports to detect potential threats before they occur."
    },
    { 
      title: "Hotspot Mapping", 
      description: "Identify high-risk areas.",
      details: "Community-reported data combined with historical incident reports create dynamic heatmaps of areas to avoid."
    },
    { 
      title: "Emergency Calling", 
      description: "Quick emergency contact access.",
      details: "One-tap emergency calling with automatic location sharing to local authorities and your trusted contacts."
    },
    { 
      title: "Safe Spaces", 
      description: "Locate verified safe places nearby.",
      details: "Find verified safe locations including police stations, hospitals, and partner businesses that provide immediate assistance."
    },
    { 
      title: "Community Support", 
      description: "Connect with local helpers.",
      details: "Our network of verified community volunteers can provide virtual or physical accompaniment when needed."
    },
    { 
      title: "Night Security", 
      description: "Enhanced night travel safety.",
      details: "Specialized night mode with increased monitoring frequency and automatic check-ins during late hours."
    },
    { 
      title: "AI-Powered Security", 
      description: "Automated security assistance.",
      details: "Our AI assistant can detect distress patterns in your voice or movement and trigger appropriate safety protocols."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/"; // Reload the page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<FeaturesPage features={features} />} />
        <Route path="/" element={
          <HomePage 
            features={features}
            activeFeature={activeFeature}
            setActiveFeature={setActiveFeature}
            user={user}
            handleLogout={handleLogout}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        } />
        <Route path="/sos" element={<Sos />} />
        <Route path="/MapOperationsPage" element={<MapOperationsPage />} />
        <Route path="/CommunityPage" element={<CommunityPage />} />
        <Route path="/Chatbot" element={<Chatbot />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;

