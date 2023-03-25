// LeaderContainer.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LeaderContainer.css';

function LeaderContainer() {
  const [leaders, setLeaders] = useState([]);

useEffect(() => {
  const fetchLeaders = async () => {
    try {
      const response = await axiosInstance.get('/api/leaders'); // Replace '/api/leaders' with your API endpoint
      setLeaders(response.data);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    }
  };

  fetchLeaders();
}, []);

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
            </div>
          </div>
        ))}
      </Slider>
    </div>
    
  );
}

export default LeaderContainer;