//LeaderPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import TwitterFeed from './TwitterFeed'
import YoutubeFeed from './YoutubeFeed'
import './LeaderPage.css';



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
    const [FeedComponent, setFeedComponent] = useState(null);
    const [videos, setVideos] = useState([]);

    const fetchNearbyLeadersFromAPI = async (slug) => {
        const response = await axiosInstance.get(`/api/leaders/slug/${slug}`);
        const data = await response.data;
        return data;
    };

    const LinkedInFeed = () => {
        // Fetch and display LinkedIn feed.
        console.log({leaderData});
        return (<div>in Linkedin in</div>);
    };

    // Then in your JSX:

  useEffect(() => {
    const fetchLeaderbyId = async () => {
      const script = document.createElement('script');
      try {

        //console.log('Trying to fetch user location...'); // Add this line
        //const userLocation = await getUserLocation();
        //console.log('User location fetched. Fetching leaders...'); // Add this line
        const data = await fetchNearbyLeadersFromAPI(slug, 10000);
        setLeaderData(data);
        setCurrentProfilePic(data.image);
        console.log(data);
        if (data.activeLink === 'twitter') {
            console.log("twitter identifed");
            //setFeedComponent(LinkedInFeed);
        } else if (data.activeLink === 'linkedin') {
            //setFeedComponent( LinkedInFeed);
        } else if (data.activeLink === 'youtube') {
            //setFeedComponent(YoutubeFeed);
        }       

      } catch (error) {
        console.error('Error fetching leader :', error);
      }
      return () => {
        //document.body.removeChild(script);
      };
    };

    fetchLeaderbyId();
  }, [slug]);


    if (!leaderData) {
        return <div>Loading...</div>;  // Show a loading state while the data is being fetched
    }
    else{
        
    }
    return (
        <div className="leader-page">
            <div className="profile-and-about">
                <div className="profile-container">
                    <div className="profile-pic-container">
                        <img src={currentProfilePic} alt="Profile" className="profile-pic" />
                    </div>
                    <p>{leaderData.statement}</p>
                    <div className="thumbnails-slider">
                    {
                        leaderData.images && Object.keys(leaderData.images).length > 0 ? (
                            Object.entries(leaderData.images).map(([key, image]) => (
                                <img
                                    key={key}
                                    src={Object.values(image).join("")}
                                    alt={`Thumbnail ${key}`}
                                    className="thumbnail"
                                    onClick={() => setCurrentProfilePic(image)}
                                />
                            ))
                        ) : (
                            <p>No images available</p>
                        )
                    }    
                    </div>
                </div>
                <div className="about-section">
                    <h2>About {leaderData.name}</h2>
                    <AboutLeader aboutText={leaderData.aboutText} />
                </div>
            </div>
            <div className="profile-container">
                <div className="agendas">
                    <h2>Agendas</h2>
                    <ul>
                        {leaderData.agendas && leaderData.agendas.map((agenda, index) => (
                            <li key={index}>{agenda}</li>
                        ))}
                    </ul>
                </div>
            <SocialLinks links={leaderData.links} />
            </div>
            {
              leaderData.activeLink === 'twitter' ? <TwitterFeed twitterid={leaderData.links.twitter} /> :
              leaderData.activeLink === 'linkedin' ? <LinkedInFeed /> :
//              leaderData.activeLink === 'youtube' ? <YoutubeFeed channelid="Lead4_Earth"/> :
              leaderData.activeLink === 'youtube' ? <YoutubeFeed channelid={leaderData.links.youtube}/> :
              null
            }

        </div>
    );
}

export default LeaderPage;
