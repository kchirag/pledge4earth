//components/LeaderForm.js

import React, { useState } from 'react';

const LeaderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    links: {
      linkedin: '',
      twitter: '',
      // ... other social media links
    },
    activeLink: '',
    image: '',
    images: '',
    statement: '',
    aboutText: 'Information about this leader is not available.',
  cityName:'',
  agendas: '',
  
  upvotes: 0,
  website : '',
  email : '',
  url_slug:'',
    // ... other fields
    location: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, links: { ...formData.links, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      images: formData.images.split(',').map(url => url.trim())
    };
    fetch('/api/leaders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </label>
      <br />

      <label>
        LinkedIn:
        <input type="url" name="linkedin" value={formData.links.linkedin} onChange={handleLinkChange} />
      </label>
      <br />

      {/* Other social media links */}
      {/* ... */}

      <label>
        Active Link:
        <input type="text" name="activeLink" value={formData.activeLink} onChange={handleInputChange} />
      </label>
      <br />

      <label>
        Image URL:
        <input type="url" name="image" value={formData.image} onChange={handleInputChange} />
      </label>
      <br />

      <label>
        Additional Image URLs (comma-separated):
        <input type="text" name="images" value={formData.images} onChange={handleInputChange} />
      </label>
      <br />

      <label>
        Statement:
        <textarea name="statement" value={formData.statement} onChange={handleInputChange} />
      </label>
      <br />

      {/* ... other fields ... */}

      <button type="submit">Submit</button>
    </form>
  );
};

export default LeaderForm;
