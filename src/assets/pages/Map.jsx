import { useState, useRef, useEffect } from 'react'
import { FaLocationArrow, FaXmark, FaLocationDot } from 'react-icons/fa6'
import './Map.css'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'

function Map() {
  const { isLoaded } = useJsApiLoader({
    // api key here__ dk
    googleMapsApiKey: "****************************************,"  
    libraries: ['places'],
  })

  const [center, setCenter] = useState({ lat: 48.8584, lng: 2.2945 })
  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState(false)
  const [locationError, setLocationError] = useState(null)

  const originRef = useRef()
  const destinationRef = useRef()

  // Function to request GPS permission
  const requestGPSPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const userLocation = { lat: latitude, lng: longitude }
          
          setCenter(userLocation)
          setCurrentLocation(userLocation)
          setLocationPermission(true)
          setLocationError(null)
          
          // Pan map to user's location if map is loaded
          if (map) {
            map.panTo(userLocation)
            map.setZoom(15)
          }
        },
        (error) => {
          console.error('GPS Permission Error:', error.message)
          setLocationPermission(false)
          setLocationError('GPS permission denied. Please allow location access.')
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation is not supported by this browser.')
    }
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
    const directionsService = new window.google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="map-container">
      <div className="map-background">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {currentLocation && (
            <Marker 
              position={currentLocation} 
              icon={{
                url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="%2300F" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          )}

          <Marker position={center} />
          
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      
      <div className="control-panel">
        {locationError && (
          <div className="error-message">
            {locationError}
          </div>
        )}

        <div className="input-row">
          <div className="input-container">
            <Autocomplete>
              <input 
                type="text" 
                placeholder="Origin" 
                ref={originRef} 
                className="input-field"
              />
            </Autocomplete>
          </div>
          <div className="input-container">
            <Autocomplete>
              <input 
                type="text" 
                placeholder="Destination" 
                ref={destinationRef} 
                className="input-field"
              />
            </Autocomplete>
          </div>

          <div className="button-group">
            <button 
              onClick={calculateRoute}
              className="calculate-route-btn"
            >
              Calculate Route
            </button>
            <button 
              onClick={clearRoute}
              className="clear-route-btn"
            >
              <FaXmark />
            </button>
          </div>
        </div>

        <div className="bottom-section">
          <div>Distance: {distance}</div>
          <div>Duration: {duration}</div>
          
          <div className="location-buttons">
            <button 
              onClick={requestGPSPermission}
              className="icon-button get-location-btn"
              title="Get GPS Location"
            >
              <FaLocationDot />
            </button>

            <button 
              onClick={() => {
                map.panTo(center)
                map.setZoom(15)
              }}
              className="icon-button center-map-btn"
              title="Center Map"
            >
              <FaLocationArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map;