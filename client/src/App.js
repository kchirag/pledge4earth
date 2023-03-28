import React, { useState, useEffect } from 'react';

import './App.css';
import LeaderContainer from './components/LeaderContainer';
import ViewsContainer from './components/ViewsContainer';
import NewsContainer from './components/NewsContainer';
import ClarifyViewContainer from './components/ClarifyViewContainer';
import ErrorBoundary from './components/ErrorBoundary';
import OrganizationSignup from './components/OrganizationSignup';



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
      {loading ? (
        <p>Loading...</p>
      ) : (
      <div className="top-containers">
        <LeaderContainer userLocation={userLocation}/>
        <ViewsContainer refreshKey={refreshKey} userLocation={userLocation}/>
        <NewsContainer />
      </div>
      )}
      <div className="bottom-container">
      <ErrorBoundary>

        <ClarifyViewContainer onNewUserView={handleNewUserView}/>
        <OrganizationSignup />

      </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
