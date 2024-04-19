import React from 'react';
import ReactDOM from 'react-dom/client';


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './widget/Widget';


// index.js or any other suitable file
//import 'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';
//import * as serviceWorker from './serviceWorker';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
