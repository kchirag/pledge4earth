// components/LinkedInCallback.js

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Adjust the import path as necessary

const LinkedInCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            // Send the code to your backend to exchange for an access token
            axiosInstance.post('/api/linkedin/callback', { code })
                .then(response => {
                    // Handle response, e.g., storing the access token, updating user data, etc.
                    navigate('/'); // Redirect to home or another page
                })
                .catch(error => {
                    console.error('Error handling LinkedIn callback:', error);
                    // Handle error, maybe redirect to an error page
                });
        }
    }, [searchParams, navigate]);

    return (
        <div>Loading...</div> // Loading message or spinner
    );
};

export default LinkedInCallback;
