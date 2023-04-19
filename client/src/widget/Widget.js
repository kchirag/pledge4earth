import React from 'react';
import ReactDOM from 'react-dom';
import ClarifyViewContainer from '../components/ClarifyViewContainer';
//import LocationModal from '../components/LocationModal';


const widgetContainer = document.getElementById('clarify-widget');
if (widgetContainer) {
  ReactDOM.render(<ClarifyViewContainer />, widgetContainer);
}
