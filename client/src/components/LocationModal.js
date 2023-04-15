import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';

import './LocationModal.css';
import axiosInstance from '../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


function LocationModal({ show, onHide, onConfirm, location }) {

  const [highlight, setHighlight] = useState(false);
  const [email,setemail] = useState('');
  const [website,setwebsite] = useState('');
  const [socialhandle,setsocialhandle] = useState('');
  const [picurl,setpicurl] = useState('');
  const [description,setdescription] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const [markerPosition, setMarkerPosition] = useState({
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
  });

  // Add the imageFile state
  const [imageFile, setImageFile] = useState(null);
  //const [buttonText, setButtonText] = useState('Upload Image');
  //const [previewKey, setPreviewKey] = useState(0);


  const handleImageChange = (e) => {
    setpicurl(null);
    console.log(e.target.files[0]);
    setImageFile(e.target.files[0]);
    //handleImageUpload();

  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
   
    if (response.data.success) {
      setpicurl(response.data.image_url);

    } else {
      // Handle error
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    handleImageUpload();
  }, [imageFile]);

  const handleChange = (e) => {
    setemail(e.target.value);
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setIsValidEmail(emailRegex.test(e.target.value));
  };    
  const [dragging, setDragging] = useState(false);
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm View/Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="map-container">
          <MapContainer
            center={[markerPosition.latitude, markerPosition.longitude]}
            zoom={8}
            style={{ width: '100%', height: '100%' }}
            whenCreated={(map) => {
              map.on('dragstart', () => setDragging(true));
              map.on('dragend', () => setDragging(false));
            }}
          >
            <MapUpdater
              center={[markerPosition.latitude, markerPosition.longitude]}
              onMoveEnd={(pos) => {
                if (!dragging) {
                  setMarkerPosition(pos);
                }
              }}
            />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[markerPosition.latitude, markerPosition.longitude]}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const newPosition = event.target.getLatLng();
                  setMarkerPosition({ latitude: newPosition.lat, longitude: newPosition.lng });
                },
              }}
              icon={L.divIcon({ className: 'custom-div-icon', html: '<div>📍</div>' })}
            />
          </MapContainer>
          <p>Move the marker to your location to confirm your location</p>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" onChange={handleChange} />
          </div>
          <div className="influential-container">
            Want to lead4earth?
            <div className="radio-group">
              <input
                type="radio"
                id="highlight-yes"
                name="highlight"
                value="yes"
                checked={highlight}
                onChange={() => setHighlight(true)}
              />
              <label htmlFor="highlight-yes">Yes</label>
            </div>
            <div className="radio-group">
              <input
                type="radio"
                id="highlight-no"
                name="highlight"
                value="no"
                checked={!highlight}
                onChange={() => setHighlight(false)}
              />
              <label htmlFor="highlight-no">No</label>
            </div>
            {highlight && (
              <div className="highlight-details">
                <label htmlFor="description">My Goal (max 100 words)</label><br/>
                <textarea style={{ width:"100%"}} id="description" name="description" onChange={(e) => setdescription(e.target.value)} required ></textarea><br/>
                <label htmlFor="website">Website:</label>
                <input type="url" id="website" name="website" onChange={(e) => setwebsite(e.target.value)} /><br/>
                <label htmlFor="social-media">Social media handle:</label>
                <input type="text" id="social-media" name="social-media" onChange={(e) => setsocialhandle(e.target.value)} /><br/>
                <label htmlFor="picture-url">Picture URL:</label>
                <input type="url" id="picture-url" name="picture-url" onChange={(e) => setpicurl(e.target.value)} value={picurl} required />
                <label htmlFor="picture-upload" className="upload-icon">
                  <svg>
                    <use xlinkHref="#upload-icon" />
                  </svg>
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    type="file"
                    id="picture-upload"
                    name="picture-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <br/>
                {imageFile && <img src={picurl} alt="Preview" height="100" />}

              </div>
            )}
            {!highlight &&(
              <div  className="non-highlight-details">
                <label htmlFor="description">Reason</label><br/>
                <textarea id="description" style={{ width:"100%"}} name="description" placeholder="Sustainability is necessary at every level to have cumulative effects" onChange={(e) => setdescription(e.target.value)} ></textarea>
              </div>
            )}

        </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            var alertmsg = "";
            if (!isValidEmail) {
              alertmsg += 'Please enter a valid email address\n'; 
              //return;
            }
            if(highlight && !picurl){
              alertmsg += 'Please enter a picture URL or upload a picture\n' 
            }
            if(highlight && !description){
              alertmsg += 'Please enter your top goals so your community can hear from you\n' 
            }
            if (!(alertmsg === "")){
              alert(alertmsg);
              return;
            } 
            onConfirm(markerPosition,  email, highlight, website, socialhandle, picurl, description);
            onHide();

          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // return (
  //   <Modal show={show} onHide={onHide} centered>
  //     <Modal.Header closeButton>
  //       <Modal.Title>Confirm Your Location</Modal.Title>
  //     </Modal.Header>
  //     <Modal.Body>
  //       <div style={{ width: '100%', height: '300px', position: 'relative' }}>
  //        <MapContainer
  //           center={[markerPosition.latitude, markerPosition.longitude]}
  //           zoom={10}
  //           style={{ width: '100%', height: '300px' }}
  //         >
  //           <MapUpdater center={[markerPosition.latitude,markerPosition.longitude]} onMoveEnd={setMarkerPosition} />

  //           <TileLayer
  //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //           />
  //           <Marker position={[markerPosition.latitude, markerPosition.longitude]} draggable>
  //             <Popup>Drag me to your location</Popup>
  //           </Marker>
  //         </MapContainer>
  //       </div>
  //     </Modal.Body>
  //     <Modal.Footer>
  //       <Button variant="secondary" onClick={onHide}>
  //         Close
  //       </Button>
  //       <Button
  //         variant="primary"
  //         onClick={() => {
  //           onConfirm(markerPosition);
  //           onHide();
  //         }}
  //       >
  //         Confirm Location
  //       </Button>
  //     </Modal.Footer>
  //   </Modal>
  // );
}

export default LocationModal;
