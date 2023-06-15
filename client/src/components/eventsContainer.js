import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import ExpandableText from './ExpandableText';


const EventsContainer = ({ userLocation }) => {
  const [nearbyEventsData, setNearbyEventsData] = useState({ events: [] });
  
  const fetchNearbyEventsFromAPI = async (latitude, longitude, distance) => {
    const response = await axiosInstance.get(`/api/events?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    return data;
  };
  useEffect(() => {
    const fetchNearbyOrganizations = async () => {
        try {

          const data = await fetchNearbyEventsFromAPI(userLocation.latitude, userLocation.longitude, 10000);
          setNearbyEventsData(data);

          if (data.events.size > 0) {
            // Set the viewport center to the first view's lat/long
            console.log(data);
          }
          
        } catch (error) {
          console.error('Error fetching Events:', error);
        }
    };

    fetchNearbyOrganizations();
  }, [userLocation]);

  return (
    <div className="orgs-container">
      <h2>Events nearby</h2>
      {/* Static data to be changed later */}

      <ul>
        {nearbyEventsData.users.map((event, index) => (
          <li
            key={index}
            style={{
              minHeight: '50px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>{event.title}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>{event.venue}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>{event.startTime}</div>
            </div>
            <div
              style={{
                maxHeight: '50px',
                maxWidth: '500px',
                overflowY: 'auto',
                fontSize: '0.8em',
                paddingLeft: '5px',
              }}
            >
              <ExpandableText maxLength={60}>{event.description}</ExpandableText>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsContainer;
