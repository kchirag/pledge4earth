import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import DOMPurify from 'dompurify';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LeaderContainer.css';

function LeaderContainer({ userLocation }) {
  //const defaultLocation = { latitude: 37.7749, longitude: -122.4194 }; // Default to San Francisco, CA

  const [leaders, setLeaders] = useState([]);
  const [showFullText, setShowFullText] = useState({});

  const fetchNearbyLeadersFromAPI = async (latitude, longitude, distance) => {
    try {
      const response = await axiosInstance.get(`/api/nearby-leaders?latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
      const data = await response.data;
      setLeaders(data.users);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    }
  };

  useEffect(() => {
    fetchNearbyLeadersFromAPI(userLocation.latitude, userLocation.longitude, 10000);
  }, [userLocation]);



  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
      <div className="LeaderContainer">
        <Slider {...settings}>
          {leaders.map((leader) => (
            <div key={leader._id} className="leader-slide">
              <div className="leader-content">
                <div className="leader-image-text">
                  <div className="image-overlay-container">
                    <img src={leader.image} alt={leader.name} className="leader-image" />
                    <div className="overlay-text">
                      <h3>{leader.name}</h3>
                      <p>{leader.statement}</p>
                      <p>{leader.distance.toFixed(1)} miles away</p>
                      <a href={`/leader/${leader.url_slug}`} target="_blank" rel="noopener noreferrer">more info</a>
                    </div>
                  </div>
                </div>
                <div className="leader-details">
                  <h4>Location: {leader.cityName}</h4>
                  {leader.aboutText ? (
                    <>
                      <h5 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(showFullText[leader._id] ? leader.aboutText : `${leader.aboutText.substring(0, 300)}...`) }}></h5>
                      {leader.aboutText.length > 300 && (
                        <a href={`/leader/${leader.url_slug}`} target="_blank" rel="noopener noreferrer">more info</a>
                      )}
                    </>
                  ) : (
                    <h5>No additional information available.</h5>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
  );
}

export default LeaderContainer;
