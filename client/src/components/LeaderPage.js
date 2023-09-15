//LeaderPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

// Leader's Profile Picture and Statement Component
function LeaderProfile({ image, statement }) {
    return (
        <div className="leader-profile">
            <img src={image} alt="Leader Profile" style={{ width: '2rem', height: '2rem' }} />
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
        <ul className="agendas">
            {agendas.map((agenda, index) => (
                <li key={index}>{agenda}</li>
            ))}
        </ul>
    );
}

// Social Media Links Component
function SocialLinks({ links }) {
    return (
        <div className="social-links">
            {/* Here, we'll display an icon for each link. For simplicity, I'm just using plain text. */}
            {links.linkedin && <a href={links.linkedin}>LinkedIn</a>}
            {links.twitter && <a href={links.twitter}>Twitter</a>}
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
    const { leaderId } = useParams();
    const [leaderData, setLeaderData] = useState(null);


    const fetchNearbyLeadersFromAPI = async (leaderId) => {
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
        const data = await fetchNearbyLeadersFromAPI(leaderId, 10000);
        console.log(data);
        setLeaderData(data);
      } catch (error) {
        console.error('Error fetching leader :', error);
      }
    };

    fetchLeaderbyId();
  }, [leaderId]);

    if (!leaderData) {
        return <div>Loading...</div>;  // Show a loading state while the data is being fetched
    }
    return (
        <div className="leader-page">
            <LeaderProfile image={leaderData.image} statement={leaderData.statement} />
            <AboutLeader aboutText={leaderData.aboutText} />
            <EnvironmentalAgendas agendas={leaderData.agendas} /> 
            <SocialLinks links={leaderData.links} />
            <SocialFeeds /* feeds or user data here */ />
        </div>
    );
}

export default LeaderPage;
