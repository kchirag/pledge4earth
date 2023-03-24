// LeaderContainer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LeaderContainer.css';

function LeaderContainer() {
  const [leaders, setLeaders] = useState([]);

useEffect(() => {
  const fetchLeaders = async () => {
    try {
      const response = await axios.get('/api/leaders'); // Replace '/api/leaders' with your API endpoint
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
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
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