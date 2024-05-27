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
        label: "Research",
        tooltip: "Research for their environmental policies independently"
      },
      {
        value: 2,
        label: "Matter If known",
        tooltip: "Look to find his environmental views on their campaign manifesto?"
      },
      {
        value: 3,
        label: "Dont Matter",
        tooltip: "Never Looked for it"
      },
      {
        value: 4,
        label: "His Party alignment matters",
        tooltip: "Party comes before environment!"
      },
    ];
  function createSlug(name, cityName) {
    const sanitizeString = (str) => {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, '') // remove special characters and punctuation
            .trim() // remove spaces from start and end
            .replace(/\s+/g, '-'); // replace spaces with hyphens
    };

    return `${sanitizeString(name)}-${sanitizeString(cityName)}`;
  }
  
  const handleConfirmLocation = async (newCoordinates, email, highlight, website, socialhandle, picurl, description, cityName) => {
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
          cityName:cityName,
          url_slug: createSlug(name, cityName),
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
          cityName:cityName,
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
      const response = await axiosInstance.post('/api/sendEmail', { to, "subject":CONFIRM_EMAIL_SUBJECT, text,'emailType':'confirmation' });
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
        cityName:userLocation?.city,
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
        <div className="questions"><h5>Curious about leaders' eco-views?</h5>
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
        <button type="button" disabled={selectedView === '' || name.trim() === '' || isValidEmail === false} onMouseDown={() => handleConfirmLocation(location, emailId, false, '', '', '', '',userLocation?.city )}>Confirm</button>
        <button type="button" id="confirmlead" disabled={selectedView === ''} onMouseDown={() => setShowModal(true)}>Confirm & Lead</button>
              {location && (
                <LocationModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  onConfirm={handleConfirmLocation}
                  location={location}
                  emailid={emailId}
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
