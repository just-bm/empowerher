import React, { PureComponent } from 'react';
import { FaPhone, FaMapMarkerAlt, FaUserShield, FaSms, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sos.css';

export default class Sos extends PureComponent {
  state = {
    isActive: false,
    location: null,
    timer: null,
    countdown: 5,
    emergencyContacts: [
    //   { name: "Police", number: "100" },
    //   { name: "Ambulance", number: "108" },
    //   { name: "Fire", number: "101" },
      { name: "Trusted Contact", number: "+916380405247" } // Your number
    ],
    locationInterval: null
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
    clearInterval(this.state.locationInterval);
  }

  getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.setState({ location: loc });
            resolve(loc);
          },
          (error) => {
            console.error("Error getting location:", error);
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  startLocationTracking = () => {
    // Update location every 5 seconds
    const interval = setInterval(() => {
      this.getLocation().catch(error => {
        console.error("Location tracking error:", error);
      });
    }, 5000);
    this.setState({ locationInterval: interval });
  };

  activateSOS = async () => {
    try {
      await this.getLocation();
      this.startLocationTracking();
      
      this.setState({ isActive: true });
      
      const timer = setInterval(() => {
        this.setState((prevState) => {
          if (prevState.countdown <= 1) {
            clearInterval(timer);
            this.sendEmergencyAlerts();
            return { countdown: 0 };
          }
          return { countdown: prevState.countdown - 1 };
        });
      }, 1000);

      this.setState({ timer });
    } catch (error) {
      alert("Could not get your location. Please enable GPS!");
    }
  };

  cancelSOS = () => {
    clearInterval(this.state.timer);
    clearInterval(this.state.locationInterval);
    this.setState({ 
      isActive: false, 
      countdown: 5,
      locationInterval: null 
    });
  };

  sendEmergencyAlerts = async () => {
    const { emergencyContacts } = this.state;
    let location = this.state.location;
    
    // If we don't have location yet, try one more time
    if (!location) {
      try {
        location = await this.getLocation();
      } catch (error) {
        console.error("Still couldn't get location", error);
      }
    }

    const mapUrl = location 
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : "Location unavailable";
    
    const message = `EMERGENCY ALERT! I need immediate help. My location: ${mapUrl}`;

    // Call primary emergency contact
    this.initiateCall(emergencyContacts[0].number);
    
    // Send SMS to all contacts
    emergencyContacts.forEach(contact => {
      this.sendSMS(contact.number, message);
    });
  };

  initiateCall = (number) => {
    // Fallback methods for different environments
    if (window.location.href.startsWith('http')) {
      window.location.href = `tel:${number}`;
    } else {
      console.log("Would call:", number);
      // For web demo purposes or environments where tel: doesn't work
      alert(`SIMULATED CALL to: ${number}`);
    }
  };

  sendSMS = (number, message) => {
    // Fallback methods for different environments
    if (window.location.href.startsWith('http')) {
      window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;
    } else {
      console.log("Would send SMS to:", number, "Message:", message);
      // For web demo purposes or environments where sms: doesn't work
      alert(`SIMULATED SMS to ${number}: ${message}`);
    }
  };

  render() {
    const { isActive, countdown, emergencyContacts, location } = this.state;

    return (
      <div className="sos-container">
        <div className="sos-header-container">
          <Link to="/features" className="back-button">
            <FaArrowLeft /> Back
          </Link>
          <h1 className="sos-header">Emergency SOS</h1>
        </div>
        
        {!isActive ? (
          <div className="sos-inactive">
            <p className="sos-warning">
              Activating will immediately alert authorities and share your live location
            </p>
            <button 
              className="sos-button"
              onClick={this.activateSOS}
            >
              ACTIVATE EMERGENCY SOS
            </button>
          </div>
        ) : (
          <div className="sos-active">
            <div className="countdown">
              <div className="countdown-number">{countdown}</div>
              <p>Sending emergency alerts in...</p>
            </div>
            
            <div className="status-info">
              {location ? (
                <p>
                  <FaMapMarkerAlt /> Sharing live location: 
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              ) : (
                <p className="error">Waiting for GPS signal...</p>
              )}
            </div>
            
            <div className="emergency-actions">
              <button 
                className="action-button" 
                onClick={() => this.initiateCall(emergencyContacts[3].number)}
              >
                <FaPhone /> Call Trusted Contact
              </button>
              
              <button 
                className="action-button" 
                onClick={() => {
                  const message = location 
                    ? `I need help at: https://maps.google.com/?q=${location.lat},${location.lng}`
                    : "I need help! (Location unavailable)";
                  this.sendSMS(emergencyContacts[3].number, message);
                }}
              >
                <FaSms /> Send Location SMS
              </button>
            </div>
            
            <button 
              className="cancel-button"
              onClick={this.cancelSOS}
            >
              CANCEL EMERGENCY
            </button>
          </div>
        )}
        
        <div className="emergency-contacts">
          <h3>Emergency Contacts</h3>
          <ul>
            {emergencyContacts.map((contact, index) => (
              <li key={index}>
                <FaUserShield /> {contact.name}: {contact.number}
                <button 
                  className="quick-action"
                  onClick={() => this.initiateCall(contact.number)}
                >
                  <FaPhone />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
