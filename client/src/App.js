import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import axios from 'axios';

import './App.css';
import LeaderContainer from './components/LeaderContainer';
import ViewsContainer from './components/ViewsContainer';
import NewsContainer from './components/NewsContainer';
import ClarifyViewContainer from './components/ClarifyViewContainer';
import ErrorBoundary from './components/ErrorBoundary';
import OrganizationSignup from './components/OrganizationSignup';
import AboutContainer from './components/AboutContainer';
import FaqsContainer from './components/FaqsContainer';
import OrganizationContainer from './components/OrganizationContainer';

// Your other components

//import Contact from './components/Contact';


function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state


  const handleNewUserView = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getUserLocation();
        console.log("from the browser");
        console.log(location);
        setUserLocation(location);
      } catch (error) {
        console.error('Error fetching user location from browser:', error);
        try{
          const location = await getLocationFromIP();
          setUserLocation(location);
        }
        catch (error1){
            console.error('Error fetching user location from IP:', error1);
        } 
      } finally {
          setLoading(false); // Set loading to false after fetching the location
      }
    };
    fetchUserLocation();
  }, []);

  //this is to get location details if user declines to share his location
  const getLocationFromIP = async () => {
    const IPINFO_API_KEY = '1f0afc3cde17f5'; 
    try {
      const response = await axios.get(`https://ipinfo.io/?token=${IPINFO_API_KEY}`);
      const { data } = response;

      if (data.status === 'fail') {
        throw new Error('Failed to get location data');
      }

      const [latitude, longitude] = data.loc.split(',').map(parseFloat);

      return {
        latitude,
        longitude,
        city: data.city,
      };
    } catch (error) {
      console.error('Error getting location from IP:', error);
      return {
        latitude: 37.7,
        longitude: -122,
        city: "San Francisco",
      };
    }
  };
  
  const getUserLocation = () => {

    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const cityName = await findNearestCity(position.coords.latitude, position.coords.longitude);
              console.log(cityName);
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                city: cityName,
              });
            } catch (error) {
              if (error.code === error.PERMISSION_DENIED) {
                    return getLocationFromIP();
                  } else {
                    console.log("An error occurred while trying to get the user's location:", error.message);
                  }              
              reject(error);
            }
          },
          (error) => {
            reject(error);
          }
        );
      }, 0);
    });
  };

  //this is to get city name on the top left of the browser bar. its worst come situation
  const findNearestCity = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
      );
      const { data } = response;

      if (data.error) {
        throw new Error(data.error);
      }

      const cityName = data.address.city || data.address.town || data.address.village;
      return cityName;
    } catch (error) {
      console.error('Error finding nearest city:', error);
      return null;
    }
  };

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <div style={{marginLeft: '1em'}}>
          <span><img
                  src="/lead4earth.png"
                  alt="Lead4Earth"
                  className="logo"
                />Lead for Earth</span>
          </div>
          <div className="menu-container">
            <Menu />
          </div>
          <div className="right-content-container">
            {/* Add your content here */}
            <p>{userLocation?.city || ''}</p>
          </div>
        </header>
        <Routes>
    
          <Route path="/About" element={<AboutContainer />} />
          <Route path="/Faqs" element={<FaqsContainer />} />
          <Route path="/" element={
            <>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="top-containers">
                  <LeaderContainer userLocation={userLocation} />
                  <ViewsContainer refreshKey={refreshKey} userLocation={userLocation} />
                  <OrganizationContainer userLocation={userLocation} />
                </div>
              )}
              <div className="bottom-container">
                <ErrorBoundary>
                  <ClarifyViewContainer onNewUserView={handleNewUserView} userLocation={userLocation} />
                  <OrganizationSignup />
                </ErrorBoundary>
              </div>
            </>
          } />
        </Routes>
      </Router>
    </div>
    )
}

export default App;
