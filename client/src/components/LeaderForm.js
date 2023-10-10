//components/LeaderForm.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { useLocation } from 'react-router-dom';

const LeaderForm = (userLocation) => {
  const { leaderId } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [imageURLs, setImageURLs] = useState([]);
  const [currentAgenda, setCurrentAgenda] = useState('');


  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    links: {
      linkedin: '',
      twitter: '',
      meta: '',
      web: '',
      instagram: '',
      threads: '',
      tiktok: '',
      youtube: '',
      blogURL: '',
      others:''
      // ... other social media links
    },
    activeLink: '',
    image: '',
    images: [],
    statement: '',
    aboutText: 'Information about this leader is not available.',
  cityName:'',
  agendas: [],
  
  upvotes: 0,
  website : '',
  email : '',
  url_slug:'',
    // ... other fields
    location: ''
  });


  const location = useLocation();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const localURL = URL.createObjectURL(file);
        setPreviewURL(localURL);
        setImageFile(file);
    }
  };
  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData1 = new FormData();
    formData1.append('image', imageFile);

    try {
        const response = await axiosInstance.post('/upload', formData1, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            setImageURLs(prevURLs => [...prevURLs, response.data.image_url]);
            setImageFile(null);
            setPreviewURL(null);
        } else {
            // Handle error
        }
    } catch (error) {
        // Handle error
    }
  };

  const fetchLeadersFromAPI = async (leaderId) => {
      var apiurl = `/api/leaders/slug/${leaderId}`;

      if (location.pathname.startsWith("/leaderEdit/id")) 
        apiurl = `/api/leaders/id/${leaderId}`;

      const response = await axiosInstance.get(apiurl);
      const data = await response.data;
      return data;
  }
  useEffect(() => {
    const fetchLeaderbyId = async () => {
      try {
        //console.log('Trying to fetch user location...'); // Add this line
        //const userLocation = await getUserLocation();
        //console.log('User location fetched. Fetching leaders...'); // Add this line
        const data = await fetchLeadersFromAPI(leaderId, 10000);
        console.log(data);
        const filledData = {
            ...formData, // Spread current defaults
            ...data, // Overwrite with fetched data
        };
        if (!filledData.cityName) filledData.cityName = userLocation?.city;
        if (!filledData.url_slug) filledData.url_slug = filledData.name.replace(" ", "-").toLowerCase() + "-" + filledData.cityName.replace(" ", "-").toLowerCase();
        setImageURLs(data.images); 
        //if (data.images.size > )
        setFormData(filledData);
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
    //console.log(html);
    //console.log(formData.aboutText);
   // const { name, value } = e.target;
    setFormData({...formData, aboutText: html});
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, links: { ...formData.links, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({...formData, images : {...formData.images, ...imageURLs}});
    const dataToSend = {
      ...formData,
    };

    const token = localStorage.getItem('token');
    console.log("Token:" + token);
    if (token){
      axiosInstance.put(`/api/leaders/${dataToSend._id}`, dataToSend, {
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
        <input type="text" name="linkedin" value={formData.links.linkedin} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        twitter/X:
        <input type="text" name="twitter" value={formData.links.twitter} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Meta/Facebook:
        <input type="text" name="meta" value={formData.links.meta} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Instagram:
        <input type="text" name="instagram" value={formData.links.instagram} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Threads:
        <input type="text" name="threads" value={formData.links.threads} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Tiktok:
        <input type="text" name="tiktok" value={formData.links.tiktok} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Youtube:
        <input type="text" name="youtube" value={formData.links.youtube} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Blog:
        <input type="url" name="blogURL" value={formData.links.blogURL} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Other:
        <input type="url" name="others" value={formData.links.others} onChange={handleLinkChange} />
      </label>
      <br />

      {/* Other social media links */}
      {/* ... */}

      <label>
        Most Active Platform:
        <select name="activeLink" value={formData.activeLink} onChange={handleInputChange}>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="meta">Meta</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">Youtube</option>
        </select>
      </label>
      <br />

      <label>
        Image URL:
        <input type="url" name="image" value={formData.image} onChange={handleInputChange} />
      </label>
      <br />
      <div>
        <input type="file" onChange={handleImageChange} />
            {previewURL && <img src={previewURL} alt="Image Preview" />}
            {imageFile && <button onClick={handleImageUpload}>Upload</button>}
            {/* Display the collected URLs */}
            {imageURLs.map((url, index) => (
                <div key={index}>{url}</div>
            ))}
      </div>
      <br />
      <div>
        <h4>Agendas List:</h4>
        <ul>
            {formData.agendas.map((agenda, index) => (
                <li key={index}>{agenda}</li>
            ))}
        </ul>
      </div>
      <label>
          Add Agenda:
          <input type="text" value={currentAgenda} onChange={(e) => setCurrentAgenda(e.target.value)} />
          <button type="button" onClick={() => {
              setFormData(prevState => ({ ...prevState, agendas: [...prevState.agendas, currentAgenda] }));
              setCurrentAgenda(''); // Clear the current agenda input
          }}>
              Add to List
          </button>
      </label>
      <br />
      <label>About 
        <ReactQuill value={formData.aboutText} onChange={handleAboutChange} />
      </label>
      <br />
      <label>
        SEOFriendlyName:
        <textarea name="url_slug" value={formData.url_slug} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Your Website:
        <textarea name="website" value={formData.website} onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Your Location (City/State/Country):
        <textarea name="cityName" value={formData.cityName} onChange={handleInputChange} />
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
