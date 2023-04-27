import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <nav>
        <ul>
          <li>
            <Link to="/PrivacyPolicy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/VolunteerForm">Volunteers</Link>
          </li>
          
          {/* Add more links as needed */}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
