import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapGL, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


function ViewsContainer({ refreshKey }) {
  //console.log(process.env.REACT_APP_MAPBOX_TOKEN);

  const [viewData, setViewData] = useState([]);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  const [nearbyUsersData, setNearbyUsersData] = useState({ count: 0, users: [] });

  const [viewport, setViewport] = useState({
    latitude: 37.7749, // Initial latitude value
    longitude: -122.4194, // Initial longitude value
    zoom: 10, // Initial zoom value
    bearing: 0,
    pitch: 0
  });

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
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
    });
  };
  
  const fetchNearbyUsersFromAPI = async (latitude, longitude, distance) => {
    const response = await fetch(`/api/nearby-users?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.json();
    return data;
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get('/api/views');
  //       setViewData(response.data);
  //       // Check if there's at least one view received from the API
  //       console.log(response.data.length);
  //       if (response.data.length > 0) {
  //         // Set the viewport center to the first view's lat/long
  //         setViewport((prevViewport) => ({
  //           ...prevViewport,
  //           latitude: response.data[0].location.coordinates[1],
  //           longitude: response.data[0].location.coordinates[0],
  //         }));
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
  const fetchUsers = async () => {
      try {
        const userLocation = await getUserLocation();
        const data = await fetchNearbyUsersFromAPI(userLocation.latitude, userLocation.longitude, 50);
        setNearbyUsersData(data);

        if (data.count > 0) {
          // Set the viewport center to the first view's lat/long
          setViewport((prevViewport) => ({
            ...prevViewport,
            latitude: data.users[0].location.coordinates[1],
            longitude: data.users[0].location.coordinates[0],
          }));
        }
        console.log(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [refreshKey]);
  
  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);
  };

  return (
    <div className="ViewsContainer">
  <div style={{ width: '100%', height: '300px', position: 'relative' }}>
    <MapGL
      {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={handleViewportChange}
      mapStyle="mapbox://styles/mapbox/light-v11"
    >
      {nearbyUsersData.users.map((view) => (


      <Marker key={view._id} latitude={view.location.coordinates[1]} longitude={view.location.coordinates[0]}>
    <div
      style={{ color: 'teal', fontSize: '34px' }}
      onMouseEnter={() => setHoveredMarkerId(view._id)}
      onMouseLeave={() => setHoveredMarkerId(null)}
    >
    •
    </div>
    {hoveredMarkerId === view._id && (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '3px',
          padding: '5px',
          position: 'absolute',
          top: '-30px',
          left: '-15px',
        }}
      >
        {view.name}
      </div>
    )}
  </Marker>
      ))}
      
    </MapGL>
    <h3>Nearby Users:</h3>
    <p>{nearbyUsersData.count} users within 50 miles</p>
  </div>
  </div>
  );
}

export default ViewsContainer;
