import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';



function LocationModal({ show, onHide, onConfirm, location }) {

  const [highlight, setHighlight] = useState(false);
  const [email,setemail] = useState('');
  const [website,setwebsite] = useState('');
  const [socialhandle,setsocialhandle] = useState('');
  const [picurl,setpicurl] = useState('');
  const [description,setdescription] = useState('');

  const [markerPosition, setMarkerPosition] = useState({
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
  });
  const [dragging, setDragging] = useState(false);
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm View/Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ width: '100%', height: '100px', marginBottom:'280px' }}>
          <MapContainer
            center={[markerPosition.latitude, markerPosition.longitude]}
            zoom={13}
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
            Be an influential voice in your community?
            <div>
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
            <div>
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
              <div>
                <label htmlFor="website">Website:</label>
                <input type="url" id="website" name="website" onChange={(e) => setwebsite(e.target.value)} /><br/>
                <label htmlFor="social-media">Social media handle:</label>
                <input type="text" id="social-media" name="social-media" onChange={(e) => setsocialhandle(e.target.value)} /><br/>
                <label htmlFor="picture-url">Picture URL:</label>
                <input type="url" id="picture-url" name="picture-url" onChange={(e) => setpicurl(e.target.value)} /><br/>
                <label htmlFor="description">My Top Goal in 100 words</label>
                <textarea id="description" name="description" onChange={(e) => setdescription(e.target.value)} ></textarea><br/>
              </div>
            )}
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" onChange={(e) => setemail(e.target.value)} />
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
            console.log()
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
