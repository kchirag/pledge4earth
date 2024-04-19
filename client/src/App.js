import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import axios from 'axios';
import { AppProvider, useAppContext } from './AppContext';


import LeaderContainer from './components/LeaderContainer';
import ViewsContainer from './components/ViewsContainer';
import NewsContainer from './components/NewsContainer';
import ClarifyViewContainer from './components/ClarifyViewContainer';
import ErrorBoundary from './components/ErrorBoundary';
import OrganizationSignup from './components/OrganizationSignup';
import AboutContainer from './components/AboutContainer';
import FaqsContainer from './components/FaqsContainer';
import OrganizationContainer from './components/OrganizationContainer';
//import TopReasonsContainer from './components/TopReasonsContainer';
import ReasonSlider from './components/ReasonSlider'
import EmailConfirmationContainer from './components/EmailConfirmationContainer'
import PrivacyPolicyContainer from './components/PrivacyPolicyContainer'
import Footer from './components/Footer';
import VolunteerPage from './components/VolunteerPage';
import LeaderPage from './components/LeaderPage';
import LeaderForm from './components/LeaderForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Typeahead } from 'react-bootstrap-typeahead';
import PostUpload from './components/PostUpload';
import PostsPage from './components/PostsPage';
import LinkedInCallback from './components/LinkedInCallback'; // Import the new component


import 'react-bootstrap-typeahead/css/Typeahead.css';
import './App.css';


// Your other components

//import Contact from './components/Contact';


function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [citySuggestions, setCitySuggestions] = useState([]);


  const fetchCitySuggestions = async (query) => {
    const apiKey = process.env.REACT_APP_GEOCODE_API_KEY;
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&limit=5`;
    //const apiUrl = `https://ipapi.co/json/`
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const suggestions = data.results.map((result) => ({
        name: result.formatted,
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      }));
      setCitySuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  const handleNewUserView = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      //try {
        //const location = await getUserLocation();
        //setUserLocation(location);
      //} catch (error) {
      //  console.error('Error fetching user location from browser:', error);
      try{
        const location = await getLocationFromIP();
        setUserLocation(location);
      }
      catch (error1){
          console.error('Error fetching user location from IP:', error1);
      } 
      finally {
          setLoading(false); // Set loading to false after fetching the location
      }
    };
    fetchUserLocation();
  }, []);

  //this is to get location details if user declines to share his location
  const getLocationFromIP = async () => {
    const IPINFO_API_KEY = process.env.REACT_APP_IPINFO_API_KEY; 
    try {
      const response = await axios.get(`https://ipapi.co/json/`);
      const { data } = response;

      if (data.status === 'fail') {
        throw new Error('Failed to get location data');
      }

      //const [latitude, longitude] = data.loc.split(',').map(parseFloat);

      return {
        latitude: data.latitude,
        longitude: data.longitude,
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
    <AppProvider>
      <div className="App">
        <Router>
          <div>

          <header className="App-header">
            <div style={{marginLeft: '1em'}}>
              <div className="infoheader">
                  <img
                    src="/logo192.png"
                    alt="Lead4Earth"
                    className="logo"
                  />
                
                <div className="site-info">
                  <span className="site-name">Lead for Earth</span>
                  <span className="tagline">Learn, Engage, Act and Direct</span>
                </div>
              </div>
            </div>
            <div className="menu-container">
              <Menu />
            </div>
            <div className="right-content-container">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </span>
                </div>
                <Typeahead
                  className="custom-typeahead city-typeahead-input"
                  id="city-typeahead"
                  labelKey="name"
                  options={citySuggestions}
                  placeholder={userLocation?.city || ''}
                  onChange={(selected) => {
                    if (selected.length > 0) {
                      setUserLocation({
                        latitude: selected[0].lat,
                        longitude: selected[0].lng,
                        city: selected[0].name,
                      })
                      //setLatLong({ lat: selected[0].lat, lng: selected[0].lng });

                    }
                  }}
                  onInputChange={(text) => {
                    if (text.length >= 3) {
                      fetchCitySuggestions(text);
                    }
                  }}

                />
              </div>
            </div>
          </header>
          <Routes>
      
            <Route path="/About" element={<AboutContainer />} />
            <Route path="/Faqs" element={<FaqsContainer />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicyContainer />} />
            <Route path="/VolunteerForm" element={<VolunteerPage />} />
            <Route path="/EmailConfirmation" element={<EmailConfirmationContainer />} />
            <Route path="/leader/:slug" element={<LeaderPage />} />
            <Route path="/leaderEdit/id/:leaderId" element={<LeaderForm userLocation={userLocation} />} />
            <Route path="/leaderEdit/:leaderId" element={<LeaderForm userLocation={userLocation} />} />
            <Route path="/linkedin-callback" element={<LinkedInCallback />} />
            <Route path="/postupload" element={<PostUpload />} />
            <Route path="/postspage" element={<PostsPage />} />

            
            <Route path="/" element={
              <>
                <ReasonSlider />
                <div className="bottom-container">
                  <ErrorBoundary>
                    <ClarifyViewContainer onNewUserView={handleNewUserView} userLocation={userLocation} />
                    <NewsContainer />
                  </ErrorBoundary>
                </div>
                {loading ? (
                  <p>Loading...</p>
                ) : (

                  <div className="top-containers">
                    <LeaderContainer userLocation={userLocation} />
                    <ViewsContainer refreshKey={refreshKey} userLocation={userLocation} />
                    <OrganizationContainer userLocation={userLocation} />
                  </div>
                )}
              </>
            } />
          </Routes>
          <Footer />
          </div>
        </Router>
      </div>
    </AppProvider>
    )
}

export default App;
