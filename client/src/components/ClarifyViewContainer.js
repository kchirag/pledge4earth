    // ClarifyViewContainer.js
import axiosInstance from '../axiosInstance';


import React, { useState } from 'react';
import LocationModal from './LocationModal';
import ShareBar from './ShareBar'
import {CONFIRM_EMAIL_MESSAGE, CONFIRM_EMAIL_SUBJECT} from '../constant'


import './ClarifyViewContainer.css'; // Import the CSS styles
    

function ClarifyViewContainer({ onNewUserView, userLocation }) {
  const [selectedView, setSelectedView] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);


  const [name, setName] = useState('');
  const [emailId, setEmailId] = useState('');
  //console.log(userLocation);
  const [location, setLocation] = useState(userLocation);
  //const [markerPosition, setMarkerPosition] = useState({ latitude: 37.7749, longitude: -122.4194 });
  const [showModal, setShowModal] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const storedName = localStorage.getItem('userName');

  const handleChangeEmailId = (e) => {
    console.log(e);
    setEmailId(e.target.value);
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setIsValidEmail(emailRegex.test(e.target.value));
  }; 

  if (!showShareOptions && storedName) setShowShareOptions(true);

  const options = [
      {
        value: 1,
        label: "On High Priority",
        tooltip: "There is conclusive evidence to demonstrate that the climate is changing and human-caused CO2 emissions are contributing to this issue. Immediate action should be taken at every level of government to decrease GHG emissions to X level by X year. (Electrification ordinances, carbon fee, etc)."
      },
      {
        value: 2,
        label: "Necessary but not urgent",
        tooltip: "Human activities are causing climate change, and we should take action to decrease emissions. However, it should be spread in future.."
      },
      {
        value: 3,
        label: "Unsure",
        tooltip: "We can take measures to improve our environment (bike, recycle, compost, etc), but government and legislative intervention is not necessary"
      },
      {
        value: 4,
        label: "Disagree",
        tooltip: "Human activities do not worsen climate change, and no intervention is needed"
      },
    ];

  
  const handleConfirmLocation = async (newCoordinates, email, highlight, website, socialhandle, picurl, description) => {
    // ... handle the confirmed location here ...
      setLocation({
            latitude: newCoordinates.latitude,
            longitude: newCoordinates.longitude,
          });

      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);

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
          emailid: email,
          isEmailConfirmed: false,
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
      console.log(email);
      sendConfirmationEmail(email)
      onNewUserView();
      setShowShareOptions(true);
  }
  async function sendConfirmationEmail(to) {
        //console.log(to);
    //console.log(name);
    try {
      const text = CONFIRM_EMAIL_MESSAGE(name);

      //console.log(text);
      const response = await axiosInstance.post('/api/sendEmail', { to, "subject":CONFIRM_EMAIL_SUBJECT, text });
      console.log(response.data.message);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  const handleChange = (event) => {
//    event.preventDefault();
    setLocation(userLocation);
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
  const handleNewView = () => {
    localStorage.setItem('userName', "");
    setShowShareOptions(false);   
  }

  return (
    <>
    {!showShareOptions && (
    <div className="clarify-view-container">
      <h6>Share your opinion</h6>
      <form onSubmit={handleSubmit}>
        <div className="questions"><h5>Want your community leader to act on environmental issues?</h5>
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
        <div class="confirmtext">
          <label htmlFor="name">Known as:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
            <label htmlFor="userlocation">&nbsp;from {userLocation?.city}&nbsp;</label>
          
        </div>
        <div class="confirmtext">
          <label htmlFor="emailId">EmailId:</label>
          <input
            type="text"
            id="emailId"
            name="emailId"
            value={emailId}
            onChange={(e) => handleChangeEmailId(e)}
          />
          
        </div>
        <div class="button-container">
        <button type="button" disabled={selectedView === '' || name.trim() === '' || isValidEmail === false} onMouseDown={() => handleConfirmLocation(location, emailId, false, '', '', '', '' )}>Confirm</button>
        <button type="button" id="confirmlead" disabled={selectedView === ''} onMouseDown={() => setShowModal(true)}>Confirm & Lead</button>
              {location && (
                <LocationModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  onConfirm={handleConfirmLocation}
                  location={location}
                />
              )}
        </div>
        
      </form>
      <br/>
      <ShareBar />
    </div>
    )}
    {showShareOptions && (
      <div className="share-container">
        <h2>Thank you for participating!</h2>
        <p>Dear {storedName},</p>
        <p>How about help us grow by sharing it with your community</p>
        <p>When the person you shared with responds we will notify you.</p>
        <p>Lets make it a global movement, Feel free to give us your honest feedback</p>
        <p>Share this survey with others:</p>
        <div className='link' onClick={() => handleNewView()} >Not {storedName}? </div>
        <ShareBar />
      </div>
    )}
    </>
  );
}

export default ClarifyViewContainer;
