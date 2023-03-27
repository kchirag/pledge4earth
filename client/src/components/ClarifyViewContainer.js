    // ClarifyViewContainer.js
import axiosInstance from '../axiosInstance';


import React, { useState, useEffect } from 'react';
import LocationModal from './LocationModal';

import './ClarifyViewContainer.css'; // Import the CSS styles
    

    function ClarifyViewContainer({ onNewUserView }) {
      const [selectedView, setSelectedView] = useState('');
      const [showShareOptions, setShowShareOptions] = useState(false);


      const [name, setName] = useState('');
      const [location, setLocation] = useState(null);
      //const [markerPosition, setMarkerPosition] = useState({ latitude: 37.7749, longitude: -122.4194 });
      const [showModal, setShowModal] = useState(false);


      const handleShare = () => {
        if (navigator.share) {
          navigator.share({
            title: 'Climate Opinion',
            text: 'Share your views, to let your leaders know you care!',
            url: window.location.href,
          }).catch((error) => console.error('Error sharing:', error));
        } else {
          alert('Sharing is not yet implemented.');
        }
      };
      const handleShareToLeader = () => {
        // Implement sharing to a leader here
        alert('Share with a leader (not implemented)');
      };

      const views = [
        'Strongly agree: \nHuman activities primarily cause climate change; immediate action needed.',
        'Agree: \nHuman activities contribute; steps to address it necessary.',
        'Neutral: \nUnsure about human activities role in climate change.',
        'Disagree: <br>Climate change isn\'t significant or influenced by human actions',
      ];
      const options = [
          {
            value: 1,
            label: "on High Priority",
            tooltip: "Human activities primarily cause climate change; immediate action needed."
          },
          {
            value: 2,
            label: "Soon but not High Priority",
            tooltip: "Human activities contribute; steps to address it necessary."
          },
          {
            value: 3,
            label: "Unsure",
            tooltip: "Unsure about human activities' role in climate change."
          },
          {
            value: 4,
            label: "Disagree",
            tooltip: "Climate change is real, but not mainly caused by humans."
          },
        ];

      
      const handleConfirmLocation = async (newCoordinates, email, highlight, website, socialhandle, picurl, description) => {
        // ... handle the confirmed location here ...
        console.log(email);
        console.log(highlight);
        console.log(socialhandle);
        console.log(newCoordinates);
          setLocation({
                latitude: newCoordinates.latitude,
                longitude: newCoordinates.longitude,
              });

          if (highlight){
            const LeaderData = {
            name,
            image: picurl,
            statement: description,
            upvotes:  0,
            website : website,
            email : email,
            socialhandle: socialhandle,
            selectedView,
            location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude],
              },
            };
            try {
              const response = await axiosInstance.post('/api/Leaders', LeaderData);
              console.log('Leader saved:', response.data);
            } catch (error) {
              console.error('Error saving user view:', error);
            }
          }
          else{
            const userViewData = {
              name,
              view: selectedView,
              location: {
                type: 'Point',
                coordinates: [location.longitude, location.latitude],
              },
            };
            
            try {
              const response = await axiosInstance.post('/api/userViews', userViewData);
              console.log('User view saved:', response.data);
            } catch (error) {
              console.error('Error saving user view:', error);
            }
          }
          onNewUserView();
          setShowShareOptions(true);
      };
      
      const handleChange = (event) => {
        event.preventDefault();
        setSelectedView(event.target.value);
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
          
        const userViewData = {
            name,
            view: selectedView,
            location: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude],
            },
          };
          
          try {
            const response = await axiosInstance.post('/api/userViews', userViewData);
            console.log('User view saved:', response.data);
          } catch (error) {
            console.error('Error saving user view:', error);
        }
        onNewUserView();
        setShowShareOptions(true);
      };

      const getUserLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      };

      useEffect(() => {
        getUserLocation();
      }, []);


      return (
        <>
        {!showShareOptions && (
        <div className="clarify-view-container">
          <h2>Pledge as Individual</h2>
          <form onSubmit={handleSubmit}>
          <div>
              <label htmlFor="name">Name or Nickname:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>Do you want your community leader to act on environmental issues?
            {options.map((view, index) => (
              <div  key={index}>
                <input
                  type="radio"
                  id={`view${index}`}
                  name="view"
                  value={view.label} // Remove the backticks to use the actual value
                  checked={selectedView === view.label}
                  onChange={handleChange}
                />
                <label htmlFor= {`view${index}`} title={view.tooltip} >{view.label}</label>
              </div>
            ))}
            </div>
            <button type="button" onMouseDown={() => setShowModal(true)}>Confirm Location</button>
                  {location && (
                    <LocationModal
                      show={showModal}
                      onHide={() => setShowModal(false)}
                      onConfirm={handleConfirmLocation}
                      location={location}
                    />
                  )}

            <button type="submit">Submit</button>
          </form>
        </div>
        )}
        {showShareOptions && (
          <div className="share-container">
            <h2>Thank you for participating!</h2>
            <p>Share this survey with others:</p>
            <button onClick={handleShare}>Share on social media</button>
            <button onClick={handleShareToLeader}>Share with a leader</button>
          </div>
        )}
        </>
      );
    }

    export default ClarifyViewContainer;
