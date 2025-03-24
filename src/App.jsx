import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./assets/pages/Login";
import "./App.css";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { title: "Route Monitoring", description: "Track your route in real time." },
    { title: "Threat Detection", description: "AI-powered safety alerts." },
    { title: "Hotspot Mapping", description: "Identify high-risk areas." },
    { title: "Emergency Calling", description: "Quick emergency contact access." },
    { title: "Safe Spaces", description: "Locate verified safe places nearby." },
    { title: "Community Support", description: "Connect with local helpers." },
    { title: "Night Security", description: "Enhanced night travel safety." },
    { title: "AI-Powered Security", description: "Automated security assistance." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
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
                      <li><a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a></li>
                      <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
                      <li><a href="#download" onClick={() => setIsMenuOpen(false)}>Download</a></li>
                      <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
                    </ul>

                    <div className="cta-buttons">
                      <Link to="/login"><button className="btn btn-outline">Log in</button></Link>
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
                        <button className="btn btn-primary">Get Started</button>
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

              {/* Features Section */}
              <section id="features" className="features">
                <div className="container">
                  <div className="section-header">
                    <h2>Comprehensive Safety Features</h2>
                    <p>Our AI-powered solution provides multiple layers of protection to ensure women travel safely.</p>
                  </div>
                  
                  <div className="features-showcase">
                    <div className="features-list">
                      {features.map((feature, index) => (
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
                          {activeFeature === 4 && <div className="animation safe-spaces"></div>}
                          {activeFeature === 5 && <div className="animation community"></div>}
                          {activeFeature === 6 && <div className="animation night-security"></div>}
                          {activeFeature === 7 && <div className="animation ai-security"></div>}
                        </div>
                      </div>
                    </div>
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
                          <li><a href="#features">Features</a></li>
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
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
