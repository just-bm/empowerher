import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRoute, 
  FaBell, 
  FaMapMarkedAlt, 
  FaPhoneAlt, 
  FaShieldAlt, 
  FaUsers,
  FaMoon,
  FaRobot
} from 'react-icons/fa';
import './FeaturesPage.css';
const FeaturesPage = () => {
  // Integrated features array with icons
  const features = [
    { 
      title: "Route Monitoring", 
      description: "Track your route in real time.",
      details: "Our advanced GPS tracking provides real-time route monitoring with predictive analysis of potential risks along your path.",
      icon: <FaRoute className="feature-icon" />,
      link: "/MapOperationsPage"
    },
    { 
      title: "Threat Detection", 
      description: "AI-powered safety alerts.",
      details: "Machine learning algorithms analyze environmental factors and user reports to detect potential threats before they occur.",
      icon: <FaBell className="feature-icon" />,
      link: "/features/threat-detection"
    },
    { 
      title: "Hotspot Mapping", 
      description: "Identify high-risk areas.",
      details: "Community-reported data combined with historical incident reports create dynamic heatmaps of areas to avoid.",
      icon: <FaMapMarkedAlt className="feature-icon" />,
      link: "/features/hotspot-mapping"
    },
    { 
      title: "Emergency Calling", 
      description: "Quick emergency contact access.",
      details: "One-tap emergency calling with automatic location sharing to local authorities and your trusted contacts.",
      icon: <FaPhoneAlt className="feature-icon" />,
      link: "/Sos"
    },
    { 
      title: "Safe Spaces", 
      description: "Locate verified safe places nearby.",
      details: "Find verified safe locations including police stations, hospitals, and partner businesses that provide immediate assistance.",
      icon: <FaShieldAlt className="feature-icon" />,
      link: "/features/safe-spaces"
    },
    { 
      title: "Community Support", 
      description: "Connect with local helpers.",
      details: "Our network of verified community volunteers can provide virtual or physical accompaniment when needed.",
      icon: <FaUsers className="feature-icon" />,
      link: "/CommunityPage"
    },
    { 
      title: "Night Security", 
      description: "Enhanced night travel safety.",
      details: "Specialized night mode with increased monitoring frequency and automatic check-ins during late hours.",
      icon: <FaMoon className="feature-icon" />,
      link: "/features/night-security"
    },
    { 
      title: "AI-Powered Security", 
      description: "Automated security assistance.",
      details: "Our AI assistant can detect distress patterns in your voice or movement and trigger appropriate safety protocols.",
      icon: <FaRobot className="feature-icon" />,
      link: "/Chatbot"
    }
  ];

  return (
    <div className="features-page">
      {/* Navigation */}
      <header className="page-header">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <Link to="/" className="logo-text">EmPower Her</Link>
            </div>
            <div className="cta-buttons">
              <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Features Hero Section */}
      <section className="features-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Comprehensive Safety Features</h1>
            <p className="subtitle">Explore how EmPower Her uses advanced technology to keep you safe in every situation</p>
          </div>
        </div>
      </section>

      {/* All Features Section */}
      <section className="all-features">
        <div className="container">
          <div className="section-intro">
            <h2>Your Safety, Our Priority</h2>
            <p>Every feature is designed with your security in mind</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Link 
                to={feature.link} 
                key={index} 
                className="feature-card-link"
              >
                <div className="feature-card">
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <p className="feature-details">{feature.details}</p>
                  <div className="feature-badge">{index + 1}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="features-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to experience complete safety?</h2>
            <p>Download EmPower Her today and take control of your security</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Download Now</button>
              <Link to="/demo" className="btn btn-outline">See Demo</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="page-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-text">EmPower Her</div>
              <p className="tagline">Safety through technology</p>
              <div className="social-links">
                <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h3>Product</h3>
                <ul>
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                  <li><Link to="/download">Download</Link></li>
                </ul>
              </div>
              <div className="link-group">
                <h3>Company</h3>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                </ul>
              </div>
              <div className="link-group">
                <h3>Legal</h3>
                <ul>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                  <li><Link to="/terms">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EmPower Her. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;