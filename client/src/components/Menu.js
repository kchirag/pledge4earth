// src/components/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/About">About</Link>
        </li>
        <li>
          <Link to="/Faqs">FAQ's</Link>
        </li>
        
      </ul>
    </nav>
  );
};

export default Menu;
