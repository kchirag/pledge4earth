import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';

import axiosInstance from '../axiosInstance';
import MapUpdater from './MapUpdater'; // Import the MapUpdater component
import HeatmapLayer from './HeatmapLayer';



function ViewsContainer({ userLocation }, { refreshKey }) {
  //console.log(process.env.REACT_APP_MAPBOX_TOKEN);


  const [nearbyUsersData, setNearbyUsersData] = useState({ count: 0, users: [] });
  const [points, setPoints] = useState({points:[]});
  const [shouldShowMap, setShouldShowMap] = useState(false);


  const [viewport, setViewport] = useState({
    center: [37.7749, -122.4194], // Initial latitude and longitude
    zoom: 10, // Initial zoom value
  });
  const dotIcon = divIcon({
    html: '<div style="color: red; font-size: 24px;">•</div>',
    className: '',
  });
 
  const fetchNearbyUsersFromAPI = async (latitude, longitude, distance) => {
    const response = await axiosInstance.get(`/api/nearby-users?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    const points = data.users.map(user => {
      const [longitude, latitude] = user.location.coordinates;
      const intensity = 1; // or any other property you want to use as intensity
      return [latitude, longitude, intensity];
    });

    return {data,points};
  };


  useEffect(() => {
  const fetchUsers = async () => {
      try {

        const {data,points} = await fetchNearbyUsersFromAPI(userLocation.latitude, userLocation.longitude, 50);
        setNearbyUsersData(data);
        setPoints(points);

        if (data.count > 0) {
          // Set the viewport center to the first view's lat/long
          console.log(data);
        
        }
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (userLocation && userLocation.latitude && userLocation.longitude) {
      // Set a timeout to delay the rendering of the MapUpdater
      const timer = setTimeout(() => {
        setShouldShowMap(true);
      }, 2000);  // Delay of 2000 milliseconds (2 seconds)
      fetchUsers();
      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
    fetchUsers();


  }, [userLocation, refreshKey]);
  
  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);

  };

return (
  <div className="ViewsContainer">
    <div style={{ width: '100%', height: '300px', position: 'relative', marginBottom:'20px'}}>
      {shouldShowMap && (
        <>
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={viewport.center}
        zoom={viewport.zoom}
        onViewportChange={handleViewportChange}
        
      >

      <MapUpdater center={nearbyUsersData.users.length > 0 ? [nearbyUsersData.users[0].location.coordinates[1], nearbyUsersData.users[0].location.coordinates[0]] : [userLocation.latitude, userLocation.longitude]} /> {/* Add the MapUpdater component */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {nearbyUsersData.users.map((view) => (
          <Marker key={view._id} icon={dotIcon} position={[view.location.coordinates[1], view.location.coordinates[0]]}>
            <Popup>{view.name}</Popup>
          </Marker>
        ))}
        <HeatmapLayer points={points} />


      </MapContainer>
      <p>{nearbyUsersData.count} people interested in knowing their <br/><b>leaders eco-views</b></p>
      </>
      )}
      
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
