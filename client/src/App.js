import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';

import './App.css';
import LeaderContainer from './components/LeaderContainer';
import ViewsContainer from './components/ViewsContainer';
import NewsContainer from './components/NewsContainer';
import ClarifyViewContainer from './components/ClarifyViewContainer';
import ErrorBoundary from './components/ErrorBoundary';
import OrganizationSignup from './components/OrganizationSignup';
import AboutContainer from './components/AboutContainer';
import FaqsContainer from './components/FaqsContainer';

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
        setUserLocation(location);
      } catch (error) {
        console.error('Error fetching user location:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching the location
      }
    };

    fetchUserLocation();
  }, []);
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }, 0);
    });
  };


  return (
    <div className="App">
              <header className="App-header">
                <h1>Pledge4Earth</h1>
              </header>
      
      <Router>
      <Menu />
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
                  <NewsContainer />
                </div>
              )}
              <div className="bottom-container">
                <ErrorBoundary>
                  <ClarifyViewContainer onNewUserView={handleNewUserView} />
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
