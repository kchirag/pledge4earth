    // ClarifyViewContainer.js
import axiosInstance from '../axiosInstance';


import React, { useState } from 'react';
import LocationModal from './LocationModal';
import ShareBar from './ShareBar'
import {CONFIRM_EMAIL_MESSAGE, CONFIRM_EMAIL_SUBJECT, LEADER_MESSAGE} from '../constant'


import './ClarifyViewContainer.css'; // Import the CSS styles
    

function ClarifyViewContainer({ onNewUserView, userLocation }) {
  const [selectedView, setSelectedView] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);


  const [name, setName] = useState('');
  //console.log(userLocation);
  const [location, setLocation] = useState(userLocation);
  //const [markerPosition, setMarkerPosition] = useState({ latitude: 37.7749, longitude: -122.4194 });
  const [showModal, setShowModal] = useState(false);

  const storedName = localStorage.getItem('userName');
  function formatEmailContent() {
    const content = LEADER_MESSAGE;

    return encodeURIComponent(content);
  }
  const emailSubject = 'United We Stand: A Heartfelt Plea to Our Esteemed Leader';
  function generateMailtoLink(subject, body) {
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
  }
  const emailContent = formatEmailContent();
  const mailtoLink = generateMailtoLink(emailSubject, emailContent)

  if (!showShareOptions && storedName) setShowShareOptions(true);
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

  const views = [
    'Strongly agree: \nHuman activities primarily cause climate change; immediate action needed.',
    'Agree: \nHuman activities contribute; steps to address it necessary.',
    'Neutral: \nUnsure about human activities role in climate change.',
    'Disagree: <br>Climate change isn\'t significant or influenced by human actions',
  ];
  const options = [
      {
        value: 1,
        label: "Highly urgent, legislative action needed",
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
    const subject = 'Email Confirmation';
    
    //console.log(to);
    //console.log(name);
    try {
      const text = CONFIRM_EMAIL_MESSAGE(name);
      //console.log(text);
      const response = await axiosInstance.post('/api/sendEmail', { to, subject, text });
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


  return (
    <>
    {!showShareOptions && (
    <div className="clarify-view-container">
      <h2>Pledge as Individual</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="name">Known as:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div><h6>Do you want your community leader to act on environmental issues?</h6>
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
        <button type="button" onMouseDown={() => setShowModal(true)}>Confirm Pledge</button>
              {location && (
                <LocationModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  onConfirm={handleConfirmLocation}
                  location={location}
                />
              )}

        
      </form>
      <ShareBar />
    </div>
    )}
    {showShareOptions && (
      <div className="share-container">
        <h2>Thank you for participating!</h2>
        <p>Dear {storedName},</p>
        <p>You can help us grow by sharing by asking your friends to clarify their opinion</p>
        <p>also feel free to refer us an organization that would help them highlight the issues they care for</p>
        <p>Share this survey with others:</p>
        <ShareBar />
      </div>
    )}
    </>
  );
}

export default ClarifyViewContainer;
