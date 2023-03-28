// LeaderContainer.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LeaderContainer.css';

function LeaderContainer({userLocation}) {
  const [leaders, setLeaders] = useState([]);

  const fetchNearbyLeadersFromAPI = async (latitude, longitude, distance) => {
    const response = await axiosInstance.get(`/api/nearby-leaders?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const data = await response.data;
    return data;
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        //console.log('Trying to fetch user location...'); // Add this line
        //const userLocation = await getUserLocation();
        //console.log('User location fetched. Fetching leaders...'); // Add this line
        const data = await fetchNearbyLeadersFromAPI(userLocation.latitude, userLocation.longitude, 10000);
        console.log(data.users);
        setLeaders(data.users);
      } catch (error) {
        console.error('Error fetching leaders:', error);
      }
    };

    fetchLeaders();
  }, [userLocation]);



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