    // ClarifyViewContainer.js
import axiosInstance from '../axiosInstance';


import React, { useState, useEffect } from 'react';
import LocationModal from './LocationModal';
import ShareBar from './ShareBar'


import './ClarifyViewContainer.css'; // Import the CSS styles
    

    function ClarifyViewContainer({ onNewUserView }) {
      const [selectedView, setSelectedView] = useState('');
      const [showShareOptions, setShowShareOptions] = useState(false);


      const [name, setName] = useState('');
      const [location, setLocation] = useState(null);
      //const [markerPosition, setMarkerPosition] = useState({ latitude: 37.7749, longitude: -122.4194 });
      const [showModal, setShowModal] = useState(false);

      const storedName = localStorage.getItem('userName');
      function formatEmailContent() {
    const content = `
      Dear [Leader's Name],

      I hope this message finds you well. As a devoted member of our community, I felt compelled to express my thoughts, along with those of many others, who stand shoulder to shoulder in unity.

      Our collective hearts beat as one, with a shared purpose and vision. We know that our opinions will carry greater weight when you, our esteemed leader, recognize the depth of our shared emotions and the power of our togetherness. We are not just individuals voicing our concerns, but a united front whose passion and dedication can help guide us towards a brighter future.

      With hope in our hearts and an unshakable belief in your leadership, we implore you to acknowledge the love and commitment that binds us together. When you understand that we are not alone in our convictions, you will see that our collective opinion is a force to be reckoned with.

      In this moment, we kindly ask you to embrace our heartfelt plea and join us in the pursuit of our shared goals. Together, we can make a difference, and together, we can build a brighter tomorrow.

      Thank you for your time and consideration, and we eagerly await your response.

      Warmest regards,

      {storedName}`;

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
          setLocation({
                latitude: newCoordinates.latitude,
                longitude: newCoordinates.longitude,
              });

          localStorage.setItem('userName', name);

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
          console.log(email);
          sendConfirmationEmail(email)
          onNewUserView();
          setShowShareOptions(true);
      };
      async function sendConfirmationEmail(to) {
        const subject = 'Email Confirmation';
        const text = `Dear ${name},

        Thank you for expressing your views:

        https://lead4earth.org/confirm/${to}

        Best regards,
        Lead4Earth Team`;
        console.log(to);
        console.log(name);
        try {
          const response = await axiosInstance.post('/api/sendEmail', { to, subject, text });
          console.log(response.data.message);
          return true;
        } catch (error) {
          console.error('Error sending email:', error);
          return false;
        }
      }
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
             <a href={mailtoLink}>Invite a Leader</a>
          </div>
        )}
        </>
      );
    }

    export default ClarifyViewContainer;
