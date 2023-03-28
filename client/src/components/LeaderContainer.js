// LeaderContainer.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LeaderContainer.css';

function LeaderContainer() {
  const [leaders, setLeaders] = useState([]);

  const fetchNearbyLeadersFromAPI = async (latitude, longitude, distance) => {
    const response = await axiosInstance.get(`/api/nearby-leaders?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    return data;
  };

useEffect(() => {
  const fetchLeaders = async () => {
    try {
      const userLocation = await getUserLocation();
      const data = await fetchNearbyLeadersFromAPI(userLocation.latitude, userLocation.longitude, 5000);
      console.log(data.users);
      setLeaders(data.users);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    }
  };

  fetchLeaders();
}, []);

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:true,
  };

  return (
    
    <div className="LeaderContainer">
      <Slider {...settings}>
        {leaders.map((leader) => (
          <div key={leader._id} className="leader-slide">
            <img src={leader.image} alt={leader.name} className="leader-image" />
            <div className="leader-text">
              <h3>{leader.name}</h3>
              <p>{leader.statement}</p>
              <p>{leader.distance.toFixed(1)} miles away</p>
              <a href={leader.website} target="_blank" rel="noopener noreferrer">more info</a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    
  );
}

export default LeaderContainer;