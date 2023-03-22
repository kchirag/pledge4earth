import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapGL, { Marker } from 'react-map-gl';

function LocationModal({ show, onHide, onConfirm, location }) {
  const [viewport, setViewport] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
    zoom: 10,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Your Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
          <MapGL
            {...viewport}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          >
            <Marker
              latitude={markerPosition.latitude}
              longitude={markerPosition.longitude}
              draggable
              onDragEnd={(event) => {
                console.log(event.lngLat.lng);
                setMarkerPosition({
                  latitude: event.lngLat.lat,
                  longitude: event.lngLat.lng,
                });
              }}
            >
              <div style={{ color: 'blue', fontSize: '24px' }}>📍</div>
            </Marker>
          </MapGL>
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
}

export default LocationModal;
