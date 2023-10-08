//LeaderPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';


// Leader's Profile Picture and Statement Component
function LeaderProfile({ image, statement }) {
    return (
        <div className="leader-profile">
            <img src={image} alt="Leader Profile" style={{ width: '10rem', height: '10rem' }} />
            <p>{statement}</p>
        </div>
    );
}

// About the Leader Component
function AboutLeader({ aboutText }) {
    return (
        <div className="about-leader" dangerouslySetInnerHTML={{ __html: aboutText }} />
    );
}

// Environmental Agendas Component
function EnvironmentalAgendas({ agendas }) {
    return (
        
            <div>{agendas}</div>
        );        
}

// Social Media Links Component
function SocialLinks({ links }) {
    return (

        <div className="social-links">
            {/* Here, we'll display an icon for each link. For simplicity, I'm just using plain text. */}
            {links["linkedin"] && <a href={links["linkedin"]}>LinkedIn</a>}&nbsp;
            {links["twitter"] && <a href={links["twitter"]}>Twitter</a>}&nbsp;
            {/* ... add other platforms similarly ... */}
        </div>
    );
}

// Social Feeds Component
// For this, you'll probably need to integrate with the respective platforms' APIs or use widgets provided by them.
function SocialFeeds({ /* feed data or user handles here */ }) {
    return (
        <div className="social-feeds">
            {/* Display the feeds. This is a placeholder and you'd need API integrations for actual data. */}
            <p>Twitter and Instagram feeds go here.</p>
        </div>
    );
}

// Main Page Component
function LeaderPage() {
    const { slug } = useParams();
    const [leaderData, setLeaderData] = useState(null);
    const [currentProfilePic, setCurrentProfilePic] = useState(null);
    

    const fetchNearbyLeadersFromAPI = async (slug) => {
        const response = await axiosInstance.get(`/api/leaders/slug/${slug}`);
        const data = await response.data;
        return data;
    };


  useEffect(() => {
    const fetchLeaderbyId = async () => {
      try {
        //console.log('Trying to fetch user location...'); // Add this line
        //const userLocation = await getUserLocation();
        //console.log('User location fetched. Fetching leaders...'); // Add this line
        const data = await fetchNearbyLeadersFromAPI(slug, 10000);
        console.log(data);
        setLeaderData(data);
      } catch (error) {
        console.error('Error fetching leader :', error);
      }
    };

    fetchLeaderbyId();
  }, [slug]);

    if (!leaderData) {
        return <div>Loading...</div>;  // Show a loading state while the data is being fetched
    }
    return (

        <div className="leader-page">
            <div className="profile-container">
              <div className="profile-pic-container">
                <img src={leaderData.image} alt="Profile" className="profile-pic" />
              </div>
                <div className="thumbnails-slider">
                    {leaderData.images && leaderData.images.length > 0 ? (
                      leaderData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index}`}
                          className="thumbnail"
                          onClick={() => setCurrentProfilePic(image)}
                        />
                      ))
                    ) : (
                      <p>No images available</p>
                    )}

                </div>
            </div>
            <p>{leaderData.statement}</p>
            <AboutLeader aboutText={leaderData.aboutText} />
            <EnvironmentalAgendas agendas={leaderData.agendas} /> 
            <SocialLinks links={leaderData.links} />
            <SocialFeeds /* feeds or user data here */ />
        </div>
    );
}

export default LeaderPage;
