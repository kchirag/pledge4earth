import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import ExpandableText from './ExpandableText';


const OrganizationContainer = ({ userLocation }) => {
  const [nearbyOrganizationsData, setNearbyOrganizationsData] = useState({ count: 0, organizations: [] });
  
  const fetchNearbyOrganizationsFromAPI = async (latitude, longitude, distance) => {
    const response = await axiosInstance.get(`/api/nearby-organizations?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    return data;
  };
  useEffect(() => {
    const fetchOrganizations = async () => {
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
    }, [userLocation, refreshKey]);

  return (
    <div className="orgs-container">
      <h2>Organizations helping us lead</h2>
      {/* Static data to be changed later */}
      
      <ul>
          {nearbyOrganizationsData.map((org, index) => (
        <li key={index}>
          <img
            src={rep.logo}
            alt={`${rep.name} logo`}
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />

          {org.name} <br/>
          <ExpandableText maxLength={50}>{org.description}</ExpandableText>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default OrganizationContainer;
