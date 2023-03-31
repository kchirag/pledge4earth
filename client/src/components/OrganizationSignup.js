import React, { useState } from 'react';
import './OrganizationSignup.css';

function OrganizationSignup() {
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    location: '',
    url: '',
    description: '',
  });
  //var showsetup = false;
  const [showsetup, setshowsetup] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const clicksignup = (e) => {
    setshowsetup(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to your server
  };

  return (
    <div className="OrganizationSignup">
      <h2>Environmental Organizations</h2>
      {showsetup ? (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orgName">Organization Name:</label>
          <input
            type="text"
            name="orgName"
            id="orgName"
            value={formData.orgName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="contactPerson">Contact Person:</label>
          <input
            type="text"
            name="contactPerson"
            id="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="url"
            name="url"
            id="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Sign Up</button>
      </form>
      ):(
        <div className="invitation-container">
          <div className="invitation-text">
            We're on a mission to include environmental organizations in every location to help amplify, endorse, and inspire local voices. 
            Are you familiar with an eco-friendly organization in your area? Extend an invitation! And if you're at the helm of a 
            non-profit environmental organization, sign up right here.
          </div>
          <button onClick={clicksignup}>Sign Up</button>
        </div>
      )}
      
    </div>
  );
}

export default OrganizationSignup;
