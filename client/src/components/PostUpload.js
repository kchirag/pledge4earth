import React, { useState } from 'react';
import axios from 'axios';

const PostUpload = () => {
    const [text, setText] = useState('');
    const [media, setMedia] = useState([]);
    const [language, setLanguage] = useState('English'); // State for language
    const [category, setCategory] = useState('awareness'); // State for language

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleMediaChange = (event) => {
        setMedia([...event.target.files]);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('text', text);
        media.forEach(file => formData.append('media', file));

        try {
            const response = await axios.post(`/api/post/${language}/${category}`, formData, { // Use language in URL
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            // Handle post upload success
        } catch (error) {
            console.error('Error uploading post:', error);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="text">Text:</label>
                <textarea id="text" value={text} onChange={handleTextChange} maxLength="1000" required />
            </div>
            <div>
                <label htmlFor="media">Media (up to 5 files):</label>
                <input type="file" id="media" multiple onChange={handleMediaChange} accept="image/*,video/*" />
            </div>
            <div>
                <label htmlFor="language">Language:</label>
                <select id="language" value={language} onChange={handleLanguageChange}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                </select>
                <select id="category" value={category} onChange={handleCategoryChange}>
                    <option value="awareness">awareness</option>
                    <option value="policies">policies</option>
                    <option value="reputatuion">reputatuion</option>
                    <option value="politics">politics</option>
                </select>
            </div>
            <button type="submit">Upload Post</button>
        </form>
    );
};

export default PostUpload;
