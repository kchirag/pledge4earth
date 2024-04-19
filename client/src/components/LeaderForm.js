//components/LeaderForm.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
//import { useLocation } from 'react-router-dom';
import './LeaderPage.css';


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
      others:'',
      youtubeChannelID:'',
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
    email : 'lead@lead4earth.org',
    url_slug:'',
    // ... other fields
    location: ''
  });
  console.log("initail call:" + leaderId)
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
        const localURL = URL.createObjectURL(file);
        setPreviewURL(localURL);
        setImageFile(file);
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    const updatedImageURLs = imageURLs.filter((_, index) => index !== indexToDelete);
    setImageURLs(updatedImageURLs);
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
            setImageURLs(prevURLs => Array.isArray(prevURLs) ? [...prevURLs, response.data.image_url] : [response.data.image_url]);
            setImageFile(null);
            setPreviewURL(null);
        } else {
            // Handle error
        }
    } catch (error) {
        // Handle error
    }
  };


  useEffect(() => {
    const fetchLeadersFromAPI = async (leaderId) => {
        var apiurl = `/api/leaders/slug/${leaderId}`;

        if (window.location.pathname.startsWith("/leaderEdit/id")) 
          apiurl = `/api/leaders/id/${leaderId}`;

        const response = await axiosInstance.get(apiurl);
        const data = await response.data;
        return data;
    }
    const fetchLeaderbyId = async () => {
      try {
        //console.log('Trying to fetch user location...'); // Add this line
        //const userLocation = await getUserLocation();
        //console.log('User location fetched. Fetching leaders...'); // Add this line
        const data = await fetchLeadersFromAPI(leaderId, 10000);
        console.log(data);
        if (!data.links) {
            data.links = {};
        }
        const filledData = {
            ...formData, // Spread current defaults
            ...data, // Overwrite with fetched data
        };
        if (!filledData.cityName) filledData.cityName = userLocation?.city;
        if (!filledData.url_slug) filledData.url_slug = filledData.name.replace(" ", "-").toLowerCase() + "-" + filledData.cityName.replace(" ", "-").toLowerCase();
        setImageURLs(data.images);
        console.log(filledData); 
        setFormData(filledData);
      } catch (error) {
        console.error('Error fetching leader :', error);
      }
    };

    fetchLeaderbyId();
    console.log(leaderId);
  }, [leaderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAboutChange = (html) => {
    setFormData({...formData, aboutText: html});
  };
  const handleLinkChange = async (e) => {
    const { name, value } = e.target;
    let updatedLinks = { ...formData.links, [name]: value };

    if (name === "youtube"){
      console.log("in youtube change");
      const apiKey = process.env.REACT_APP_YOUTUBE_APIKEY;
      const response = await fetch(
            `https://youtube.googleapis.com/youtube/v3/search?q=${value}&key=${apiKey}`
          );
      const data = await response.json();
      if (data.items[0] && data.items[0].id.kind === 'youtube#channel'){
        const channelId =  data.items[0].id.channelId;
        updatedLinks['youtubeChannelID'] = channelId;

      }
    }
    setFormData({ ...formData, links: updatedLinks });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //setFormData({...formData, images : {...formData.images, ...imageURLs}});
    const dataToSend = {
      ...formData,
      images: imageURLs
    };

    const token = localStorage.getItem('token');
    console.log("Token:" + token);
    console.log(formData.links);
    if (token){
      const method = window.location.href.endsWith('new') ? 'post' : 'put';

      if (method === 'put'){
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
          axiosInstance.post(`/api/leaders/`, dataToSend, {
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

        }
    }else{

    }
  };
  const handleLinkedInLogin = () => {
    // Redirect to LinkedIn for OAuth
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=863lkr6dn3afkj&redirect_uri=https://lead4earth.org&scope=email`;
    window.location.href = linkedInAuthUrl;
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
        Web/Blog:
        <input type="url" name="web" value={formData.links.web} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Others:
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
            {previewURL && <img src={previewURL} alt="Preview" />}
            {imageFile && <button onClick={handleImageUpload}>Upload</button>}
            {/* Display the collected URLs */}
            {imageURLs.map((url, index) => (
              <div key={index} className="image-wrapper">
                <img src={url} alt={`${index}`} />
                <button onClick={() => handleDeleteImage(index)}>Delete</button>
              </div>
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
