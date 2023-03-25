import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapUpdater from './MapUpdater';


function LocationModal({ show, onHide, onConfirm, location }) {


  const [markerPosition, setMarkerPosition] = useState({
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
  });
  const [dragging, setDragging] = useState(false);
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Your Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ width: '100%', height: '300px' }}>
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onConfirm(markerPosition);
            onHide();
          }}
        >
          Confirm Location
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
