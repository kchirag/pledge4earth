//LeaderPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import TwitterFeed from './TwitterFeed'
import YoutubeFeed from './YoutubeFeed'
import './LeaderPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faYoutube, faTiktok, faBlogger, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const LinkedInFeed = () => {
    // Fetch and display LinkedIn feed.
    return (<div>in Linkedin in</div>);
};

const BASE_URLS = {
    linkedin: 'https://www.linkedin.com/in/',
    twitter: 'https://twitter.com/',
    facebook: 'https://www.facebook.com/',
    tiktok: 'https://www.tiktok.com/@',
    youtube: 'https://www.youtube.com/user/',
    instagram: 'https://www.instagram.com/',
    threads: 'https://www.instagram.com/@' // Base URL for threads
};
const getIcon = (platform) => {
    switch(platform) {
        case "linkedin":
            return faLinkedin;
        case "twitter":
            return faTwitter;
        case "facebook":
            return faFacebook;
        case "instagram":
            return faInstagram;
        case "tiktok":
            return faTiktok;
        case "youtube":
            return faYoutube;
        // ... add other platforms similarly ...
        default:
            return null;
    }
};
const iconStyle = {
    marginRight: '10px'
};

function getUrl(platform, value) {
    if (!value) return null;

    // Check if value looks like a URL (simple check for 'http' or 'www')
    if (value.startsWith('http') || value.startsWith('www')) {
        return value;
    }

    // Otherwise, assume it's an ID and append to base URL
    return BASE_URLS[platform] + value;
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
            {Object.keys(links).map((platform, index, arr) => (
                links[platform] && (
                    <a 
                        key={platform} 
                        href={getUrl(platform, links[platform])} 
                        style={index !== arr.length - 1 ? iconStyle : {}}
                    >
                        <FontAwesomeIcon icon={getIcon(platform)} />
                    </a>
                )
            ))}
        </div>
    );
}
// Define default props for the SocialLinks component
SocialLinks.defaultProps = {
    links: {}
};
// Social Feeds Component
// For this, you'll probably need to integrate with the respective platforms' APIs or use widgets provided by them.
function SocialFeeds({ links, activeLink }) {
    return (
        <div className="social-feeds">
            {
              activeLink === 'twitter' ? <TwitterFeed twitterid={links.twitter} /> :
              activeLink === 'linkedin' ? <LinkedInFeed /> :
              activeLink === 'youtube' ? <YoutubeFeed channelName={links.youtube} channelid={links.youtubeChannelID} /> :
              null
            }

            {/* Display the feeds. This is a placeholder and you'd need API integrations for actual data. */}
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
        console.log(data);
        return data;
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
                                    src={image}
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
                    {leaderData.agendas && leaderData.agendas.length > 0 && (
                        <div className="agendas">
                            <h2>Agendas</h2>
                            <ul>
                                {leaderData.agendas.map((agenda, index) => (
                                    <li key={index}>{agenda}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <SocialLinks links={leaderData.links} />
                </div>
                <div className="about-section">
                    <h2>About {leaderData.name}</h2>
                    <AboutLeader aboutText={leaderData.aboutText} />
                </div>
                <SocialFeeds links={leaderData.links} activeLink={leaderData.activeLink} />
            </div>

        </div>
    );
}

export default LeaderPage;
