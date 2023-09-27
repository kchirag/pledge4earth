//components/LeaderForm.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const LeaderForm = () => {
  const { leaderId } = useParams();
  const [editorHtml, setEditorHtml] = useState(''); // maintain state for the editor content

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
  const fetchLeadersFromAPI = async (leaderId) => {
        const response = await axiosInstance.get(`/api/leaders/${leaderId}`);
        const data = await response.data;
        return data;
    };
  useEffect(() => {
    const fetchLeaderbyId = async () => {
      try {
        //console.log('Trying to fetch user location...'); // Add this line
        //const userLocation = await getUserLocation();
        //console.log('User location fetched. Fetching leaders...'); // Add this line
        const data = await fetchLeadersFromAPI(leaderId, 10000);
        console.log(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching leader :', error);
      }
    };

    fetchLeaderbyId();
  }, [leaderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAboutChange = (html) => {
    //console.log(e);
   // const { name, value } = e.target;
   // setFormData({...formData, "aboutText": html});
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, links: { ...formData.links, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
    };

    const token = localStorage.getItem('token');
    console.log("Token:" + token);
    if (token){
      axiosInstance.put(`/api/leaders/${leaderId}`, dataToSend, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }else{

    }
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
      <label>About 
        <ReactQuill value={formData.aboutText} onChange={handleAboutChange} />
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
