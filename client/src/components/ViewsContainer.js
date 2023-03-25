import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';

import axiosInstance from '../axiosInstance';
import MapUpdater from './MapUpdater'; // Import the MapUpdater component



function ViewsContainer({ refreshKey }) {
  //console.log(process.env.REACT_APP_MAPBOX_TOKEN);


  const [nearbyUsersData, setNearbyUsersData] = useState({ count: 0, users: [] });


  const [viewport, setViewport] = useState({
    center: [37.7749, -122.4194], // Initial latitude and longitude
    zoom: 10, // Initial zoom value
  });
  const dotIcon = divIcon({
    html: '<div style="color: red; font-size: 24px;">•</div>',
    className: '',
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
    const response = await axiosInstance.get(`/api/nearby-users?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    return data;
  };


  useEffect(() => {
  const fetchUsers = async () => {
      try {
        const userLocation = await getUserLocation();
        const data = await fetchNearbyUsersFromAPI(userLocation.latitude, userLocation.longitude, 50);
        setNearbyUsersData(data);

        if (data.count > 0) {
          // Set the viewport center to the first view's lat/long
          console.log(data);
          
          //   map.flyTo([data.users[0].location.coordinates[1], viewData[0].longitude], 13);
          // setViewport((prevViewport) => ({
          //   ...prevViewport,
          //   latitude: data.users[0].location.coordinates[1],
          //   longitude: data.users[0].location.coordinates[0],
          //   zoom:20,
          // }));
        }
        
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
    <div style={{ width: '100%', height: '300px', position: 'relative', marginBottom:'20px'}}>
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={viewport.center}
        zoom={viewport.zoom}
        onViewportChange={handleViewportChange}
        
      >
      <MapUpdater center={nearbyUsersData.users.length > 0 ? [nearbyUsersData.users[0].location.coordinates[1], nearbyUsersData.users[0].location.coordinates[0]] : [37.7,-120]} /> {/* Add the MapUpdater component */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {nearbyUsersData.users.map((view) => (
          <Marker key={view._id} icon={dotIcon} position={[view.location.coordinates[1], view.location.coordinates[0]]}>
            <Popup>{view.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <h3>Nearby Users:</h3>
      <p>{nearbyUsersData.count} users within 50 miles</p>
      
    </div>
  </div>

  );


  // return (
  //   <div className="ViewsContainer">
  // <div style={{ width: '100%', height: '300px', position: 'relative' }}>
  //   <MapGL
  //     {...viewport}
  //     mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
  //     onViewportChange={handleViewportChange}
  //     mapStyle="mapbox://styles/mapbox/light-v11"
  //   >
  //     {nearbyUsersData.users.map((view) => (


  //     <Marker key={view._id} latitude={view.location.coordinates[1]} longitude={view.location.coordinates[0]}>
  //   <div
  //     style={{ color: 'teal', fontSize: '34px' }}
  //     onMouseEnter={() => setHoveredMarkerId(view._id)}
  //     onMouseLeave={() => setHoveredMarkerId(null)}
  //   >
  //   •
  //   </div>
  //   {hoveredMarkerId === view._id && (
  //     <div
  //       style={{
  //         backgroundColor: 'white',
  //         borderRadius: '3px',
  //         padding: '5px',
  //         position: 'absolute',
  //         top: '-30px',
  //         left: '-15px',
  //       }}
  //     >
  //       {view.name}
  //     </div>
  //   )}
  // </Marker>
  //     ))}
      
  //   </MapGL>
  //   <h3>Nearby Users:</h3>
  //   <p>{nearbyUsersData.count} users within 50 miles</p>
  // </div>
  // </div>
  // );
  
}

export default ViewsContainer;
