import React, { useState } from 'react';

function OrganizationSignup() {
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    location: '',
    url: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to your server
  };

  return (
    <div className="OrganizationSignup">
      <h2>Organization Sign Up</h2>
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
    </div>
  );
}

export default OrganizationSignup;
