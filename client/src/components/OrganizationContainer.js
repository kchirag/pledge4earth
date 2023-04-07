import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import ExpandableText from './ExpandableText';


const OrganizationContainer = ({ userLocation }) => {
  const [nearbyOrganizationsData, setNearbyOrganizationsData] = useState({ count: 0, users: [] });
  
  const fetchNearbyOrganizationsFromAPI = async (latitude, longitude, distance) => {
    const response = await axiosInstance.get(`/api/nearby-organizations?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    return data;
  };
  useEffect(() => {
    const fetchNearbyOrganizations = async () => {
        try {

          const data = await fetchNearbyOrganizationsFromAPI(userLocation.latitude, userLocation.longitude, 10000);
          setNearbyOrganizationsData(data);

          if (data.count > 0) {
            // Set the viewport center to the first view's lat/long
            console.log(data);
          }
          
        } catch (error) {
          console.error('Error fetching organizations:', error);
        }
    };

    fetchNearbyOrganizations();
  }, [userLocation]);

  return (
    <div className="orgs-container">
      <h2>Organizations helping us lead</h2>
      {/* Static data to be changed later */}

      <ul>
        {nearbyOrganizationsData.users.map((org, index) => (
          <li
            key={index}
            style={{
              minHeight: '50px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={org.image}
                type="image/svg+xml"
                alt={`${org.name} logo`}
                style={{ height: '15px', marginRight: '10px' }}
              />
              <div>{org.name}</div>
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
              <ExpandableText maxLength={60}>{org.description}</ExpandableText>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizationContainer;
