    // ClarifyViewContainer.js
    import axios from 'axios';

    import React, { useState, useEffect } from 'react';
    import LocationModal from './locationModal';
    import ErrorBoundary from './ErrorBoundary';


    function ClarifyViewContainer({ onNewUserView }) {
      const [selectedView, setSelectedView] = useState('');

      const [name, setName] = useState('');
      const [location, setLocation] = useState(null);
      //const [markerPosition, setMarkerPosition] = useState({ latitude: 37.7749, longitude: -122.4194 });
      const [showModal, setShowModal] = useState(false);



      const views = [
        'Climate change is occurring, and immediate action is necessary.',
        'Climate change is occurring, actions to mitigate the risk are not urgent.',
        'Climate is changing and it\'s due to human activity.',
        'Climate is changing; there is nothing humans can do to avoid it.',
        'Climate is not changing; it\'s just a weather pattern.',
      ];

      const handleModal = () => {
        setShowModal(!showModal);
      };
      const handleConfirmLocation = (newCoordinates) => {
        // ... handle the confirmed location here ...
        console.log(newCoordinates);
          setLocation({
                latitude: newCoordinates.latitude,
                longitude: newCoordinates.longitude,
              });
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
        const response = await axios.post('/api/userViews', userViewData);
        console.log('User view saved:', response.data);
      } catch (error) {
        console.error('Error saving user view:', error);
      }

      onNewUserView();
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
            {views.map((view, index) => (
              <div  key={index}>
                <input
                  type="radio"
                  id={`view${index}`}
                  name="view"
                  value={view}
                  checked={selectedView === view}
                  onChange={handleChange}
                />
                <label htmlFor={`view${index}`}>{view}</label>
              </div>
            ))}
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
      );
    }

    export default ClarifyViewContainer;
