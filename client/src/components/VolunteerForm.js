//VolunteerForm.js
import React, { useState } from 'react';
import './VolunteerForm.css';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    about: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to the backend
  };

  return (
    <form id="volunteer-application-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="medium-width"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          className="medium-width"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          className="medium-width"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="about">Tell us about yourself:</label>
        <textarea
          id="about"
          name="about"
          className="large-width"
          rows="4"
          value={formData.about}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="resume">Upload your resume (optional):</label>
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit">Submit Application</button>
    </form>
  );
};

export default VolunteerForm;
