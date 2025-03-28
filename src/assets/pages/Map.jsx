import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Circle } from '@react-google-maps/api';
import './Map.css';

const Map = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [crimeData, setCrimeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [safestRoute, setSafestRoute] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [radius, setRadius] = useState(2000);
  const [womenPlacesRadius, setWomenPlacesRadius] = useState(3000);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeMode, setRouteMode] = useState(false);
  const [sourceInput, setSourceInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [womenPlaces, setWomenPlaces] = useState([]);
  const [showWomenPlaces, setShowWomenPlaces] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const mapRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '100vh'
  };

  // Center the map on Chennai, Tamil Nadu
  const center = {
    lat: 13.0827,
    lng: 80.2707
  };

  // Simple circle path for markers
  const circleSymbol = {
    path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
    fillOpacity: 1,
    strokeWeight: 1
  };

  // Load crime data for Tamil Nadu
  useEffect(() => {
    const tamilNaduCrimeData = [
      { lat: 13.0827, lng: 80.2707, type: 'Robbery', severity: 'high' },
      { lat: 11.0168, lng: 76.9558, type: 'Theft', severity: 'medium' },
      { lat: 9.9252, lng: 78.1198, type: 'Assault', severity: 'high' },
      { lat: 10.7905, lng: 78.7047, type: 'Burglary', severity: 'medium' },
      { lat: 8.7139, lng: 77.7567, type: 'Vandalism', severity: 'low' }
    ];
    setCrimeData(tamilNaduCrimeData);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(loc);
          setSourceInput("My Location");
          if (geocoder) {
            geocoder.geocode({ location: loc }, (results) => {
              if (results[0]) {
                setSourceInput(results[0].formatted_address);
              }
            });
          }
        },
        () => {
          console.log("Geolocation permission denied");
          setCurrentLocation(center);
        }
      );
    } else {
      setCurrentLocation(center);
    }
  }, [geocoder]);

  const handleApiLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
    setAutocompleteService(new window.google.maps.places.AutocompleteService());
    setGeocoder(new window.google.maps.Geocoder());
    setPlacesService(new window.google.maps.places.PlacesService(map));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !autocompleteService) return;
    
    autocompleteService.getPlacePredictions(
      { input: searchQuery, componentRestrictions: { country: 'in' } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSearchResults(predictions);
        } else {
          setSearchResults([]);
        }
      }
    );
  };

  const handlePlaceSelect = (placeId, isDestination = false) => {
    if (!placesService) return;
    
    placesService.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        if (isDestination) {
          setDestination(location);
          setDestinationInput(place.formatted_address);
          if (mapRef.current) {
            mapRef.current.panTo(location);
          }
        } else {
          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(15);
          }
        }
        setSearchResults([]);
      }
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setRouteMode(false);
  };

  const findSafestRoute = () => {
    if ((!sourceInput || !destinationInput) && (!currentLocation || !destination)) {
      alert("Please enter both source and destination");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    // Determine origin (either current location or entered address)
    const origin = sourceInput === "My Location" && currentLocation ? 
      new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng) : 
      sourceInput;
    
    // Determine destination (either clicked location or entered address)
    const destinationPoint = destination ? 
      new window.google.maps.LatLng(destination.lat, destination.lng) : 
      destinationInput;
    
    directionsService.route(
      {
        origin,
        destination: destinationPoint,
        travelMode: window.google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const routesWithSafetyScores = result.routes.map(route => {
            const path = route.overview_path;
            let safetyScore = 0;
            
            // Calculate safety score based on nearby crimes
            path.forEach(point => {
              crimeData.forEach(crime => {
                const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                  point,
                  new window.google.maps.LatLng(crime.lat, crime.lng)
                );
                if (distance < 500) { // 500m radius
                  safetyScore += crime.severity === 'high' ? 3 : 
                               crime.severity === 'medium' ? 2 : 1;
                }
              });
            });
            
            return { 
              route, 
              safetyScore, 
              distance: route.legs[0].distance.value 
            };
          });
          
          // Find safest route (lowest score) with reasonable distance
          const safest = routesWithSafetyScores.reduce((prev, current) => 
            current.safetyScore < prev.safetyScore ? current : 
            (current.safetyScore === prev.safetyScore && current.distance < prev.distance) ? current : prev
          );
          
          setSafestRoute(safest.route);
        } else {
          console.error(`Error fetching directions: ${status}`);
          alert("Could not find route. Please check your locations.");
        }
      }
    );
  };

  const findWomenPlaces = () => {
    if (!currentLocation || !placesService) {
      alert("Please enable location services to find women's safety places");
      return;
    }
    
    setIsLoadingPlaces(true);
    
    // List of keywords to search for women's safety places
    const keywords = [
      'women police station',
      'women help desk',
      'women hospital',
      'women safety center',
      'women protection center',
      'women NGO',
      'women helpline center',
      'women toilet',
      'women only space'
    ];
    
    // Array to store all found places
    let allPlaces = [];
    
    // Function to process each keyword search
    const searchWithKeyword = (index) => {
      if (index >= keywords.length) {
        // All keywords processed
        setWomenPlaces(allPlaces);
        setShowWomenPlaces(true);
        setIsLoadingPlaces(false);
        
        // Pan to show all women's places if there are any
        if (allPlaces.length > 0 && mapRef.current) {
          const bounds = new window.google.maps.LatLngBounds();
          allPlaces.forEach(place => {
            bounds.extend(place.geometry.location);
          });
          // Include current location in the bounds
          bounds.extend(new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng));
          mapRef.current.fitBounds(bounds);
        }
        return;
      }
      
      const request = {
        location: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
        radius: womenPlacesRadius,
        keyword: keywords[index]
      };
      
      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Filter out duplicates and add to allPlaces
          results.forEach(newPlace => {
            const isDuplicate = allPlaces.some(existingPlace => 
              existingPlace.place_id === newPlace.place_id
            );
            if (!isDuplicate) {
              allPlaces.push(newPlace);
            }
          });
        }
        
        // Process next keyword
        searchWithKeyword(index + 1);
      });
    };
    
    // Start searching with the first keyword
    searchWithKeyword(0);
  };

  const getCrimeMarkerColor = (severity) => {
    switch (severity) {
      case 'high': return '#FF0000';
      case 'medium': return '#FFA500';
      case 'low': return '#FFFF00';
      default: return '#808080';
    }
  };

  const getPlaceIcon = (place) => {
    const name = place.name.toLowerCase();
    const types = place.types || [];
    
    let iconColor = '#4285F4';
    let iconText = 'W';
    
    if (name.includes('police') || types.includes('police')) {
      iconColor = '#34A853';
      iconText = 'P';
    } else if (name.includes('hospital') || types.includes('hospital') || types.includes('health')) {
      iconColor = '#EA4335';
      iconText = 'H';
    } else if (name.includes('help') || name.includes('safety') || name.includes('protection')) {
      iconColor = '#FBBC05';
      iconText = 'S';
    } else if (name.includes('toilet') || name.includes('restroom')) {
      iconColor = '#9E69AF';
      iconText = 'T';
    }
    
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: iconColor,
      fillOpacity: 0.9,
      strokeColor: 'white',
      strokeWeight: 1,
      scale: 10,
      label: {
        text: iconText,
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    };
  };

  const handleMapClick = (e) => {
    if (routeMode) {
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setDestination(clickedLocation);
      
      // Reverse geocode to get address
      if (geocoder) {
        geocoder.geocode({ location: clickedLocation }, (results) => {
          if (results[0]) {
            setDestinationInput(results[0].formatted_address);
          } else {
            setDestinationInput("Selected Location");
          }
        });
      }
    }
  };

  const startRoutePlanning = () => {
    setRouteMode(true);
    setSafestRoute(null);
    setDestination(null);
    setDestinationInput('');
  };

  const clearWomenPlaces = () => {
    setWomenPlaces([]);
    setShowWomenPlaces(false);
  };

  return (
    <div className="map-container">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
          <h1 className="app-title">Tamil Nadu Safety Map</h1>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search places in Tamil Nadu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result) => (
                  <div 
                    key={result.place_id}
                    className="search-result-item"
                    onClick={() => handlePlaceSelect(result.place_id)}
                  >
                    {result.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </nav>

      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <h2>Safety Features</h2>
        
        {!routeMode ? (
          <>
            <div className="sidebar-section">
              <h3>Crime Hotspots</h3>
              <div className="radius-control">
                <label>Radius: {radius}m</label>
                <input 
                  type="range" 
                  min="500" 
                  max="5000" 
                  step="100" 
                  value={radius} 
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                />
              </div>
              <button 
                className="action-button"
                onClick={() => {
                  if (currentLocation) {
                    console.log("Showing crime hotspots within", radius, "meters");
                  } else {
                    alert("Please enable location services");
                  }
                }}
              >
                Show Nearby Crime
              </button>
            </div>

            <div className="sidebar-section">
              <h3>Women's Safety Places</h3>
              <div className="radius-control">
                <label>Radius: {womenPlacesRadius}m</label>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="100" 
                  value={womenPlacesRadius} 
                  onChange={(e) => setWomenPlacesRadius(parseInt(e.target.value))}
                />
              </div>
              <div className="action-buttons">
                <button 
                  className="action-button"
                  onClick={findWomenPlaces}
                  disabled={isLoadingPlaces}
                >
                  {isLoadingPlaces ? 'Searching...' : showWomenPlaces ? 'Update Places' : 'Find Safety Places'}
                </button>
                {showWomenPlaces && (
                  <button 
                    className="action-button secondary"
                    onClick={clearWomenPlaces}
                  >
                    Hide Places
                  </button>
                )}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Route Planning</h3>
              <button 
                className="action-button"
                onClick={startRoutePlanning}
              >
                Plan Safest Route
              </button>
            </div>

            <div className="sidebar-section">
              <h3>Legend</h3>
              <div className="legend-item">
                <div className="legend-color high-severity"></div>
                <span>High Crime</span>
              </div>
              <div className="legend-item">
                <div className="legend-color medium-severity"></div>
                <span>Medium Crime</span>
              </div>
              <div className="legend-item">
                <div className="legend-color low-severity"></div>
                <span>Low Crime</span>
              </div>
              {showWomenPlaces && (
                <>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#34A853'}}></div>
                    <span>Police Station</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#EA4335'}}></div>
                    <span>Hospital</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#FBBC05'}}></div>
                    <span>Safety Center</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#9E69AF'}}></div>
                    <span>Women Toilet</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#4285F4'}}></div>
                    <span>Other Facility</span>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="route-planning">
            <h3>Plan Safest Route</h3>
            <div className="route-input">
              <label>Source:</label>
              <div className="search-container">
                <input
                  type="text"
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  placeholder="Enter source or use your location"
                />
                {sourceInput !== "My Location" && (
                  <button 
                    className="small-button"
                    onClick={() => {
                      setSourceInput("My Location");
                      if (currentLocation && geocoder) {
                        geocoder.geocode({ location: currentLocation }, (results) => {
                          if (results[0]) {
                            setSourceInput(results[0].formatted_address);
                          }
                        });
                      }
                    }}
                  >
                    Use My Location
                  </button>
                )}
              </div>
            </div>
            <div className="route-input">
              <label>Destination:</label>
              <div className="search-container">
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  placeholder="Click on map or enter destination"
                />
                {destinationInput && (
                  <button 
                    className="small-button"
                    onClick={() => {
                      setDestinationInput('');
                      setDestination(null);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="route-buttons">
              <button 
                className="action-button primary"
                onClick={findSafestRoute}
                disabled={!sourceInput || (!destinationInput && !destination)}
              >
                Find Safest Route
              </button>
              <button 
                className="action-button secondary"
                onClick={() => setRouteMode(false)}
              >
                Cancel
              </button>
            </div>
            {destination && (
              <div className="route-instructions">
                <p>Click on the map to change destination or type an address</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <LoadScript 
          googleMapsApiKey=""
          libraries={['places', 'geometry']}
          onLoad={() => setMapLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation || center}
            zoom={12}
            onLoad={handleApiLoad}
            onClick={handleMapClick}
          >
            {currentLocation && (
              <>
                <Marker
                  position={currentLocation}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 1,
                    scale: 10,
                    label: {
                      text: "Y",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }
                  }}
                  title="Your Location"
                />
                <Circle
                  center={currentLocation}
                  radius={radius}
                  options={{
                    fillColor: "#FF0000",
                    fillOpacity: 0.1,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.4,
                    strokeWeight: 1
                  }}
                />
              </>
            )}

            {destination && (
              <Marker
                position={destination}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: "#34A853",
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 1,
                  scale: 10,
                  label: {
                    text: "D",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }
                }}
                title="Destination"
              />
            )}

            {mapLoaded && crimeData.map((crime, index) => (
              <Marker
                key={`crime-${index}`}
                position={{ lat: crime.lat, lng: crime.lng }}
                icon={{
                  ...circleSymbol,
                  scale: 6,
                  fillColor: getCrimeMarkerColor(crime.severity),
                  strokeColor: "#ffffff"
                }}
                title={`${crime.type} (${crime.severity})`}
              />
            ))}

            {showWomenPlaces && womenPlaces.map((place, index) => (
              <Marker
                key={`women-${index}`}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }}
                icon={getPlaceIcon(place)}
                title={place.name}
                onClick={() => {
                  // Show info window when clicked
                  const content = `
                    <div class="info-window">
                      <h3>${place.name}</h3>
                      ${place.vicinity ? `<p>${place.vicinity}</p>` : ''}
                      ${place.rating ? `<p>Rating: ${place.rating} ★</p>` : ''}
                      ${place.types ? `<p>Type: ${place.types.join(', ')}</p>` : ''}
                    </div>
                  `;
                  
                  const infoWindow = new window.google.maps.InfoWindow({
                    content: content
                  });
                  
                  infoWindow.open(mapRef.current, this);
                }}
              />
            ))}

            {safestRoute && (
              <DirectionsRenderer
                directions={safestRoute}
                options={{
                  polylineOptions: {
                    strokeColor: "#4285F4",
                    strokeOpacity: 0.8,
                    strokeWeight: 6
                  },
                  suppressMarkers: true
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default Map;