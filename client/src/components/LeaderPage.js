//LeaderPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import TwitterFeed from './TwitterFeed'
import YoutubeFeed from './YoutubeFeed'
import './LeaderPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faLinkedin, faYoutube, faTiktok, faBlogger, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEdit, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import {CLAIM_EMAIL_MESSAGE, CLAIM_EMAIL_SUBJECT} from '../constant'
import { useNavigate } from 'react-router-dom';
import { InstagramEmbed } from 'react-social-media-embed';

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
    const isLoggedIn = localStorage.getItem('token') !== null;

    const fetchNearbyLeadersFromAPI = async (slug) => {
        const response = await axiosInstance.get(`/api/leaders/slug/${slug}`);
        const data = await response.data;
        console.log(data);
        return data;
    };
    


    // Then in your JSX:

  useEffect(() => {
      // Initialize the Facebook SDK
    window.fbAsyncInit = function() {
        window.FB.init({
          appId: '613070123469614',
          xfbml: true,
          version: 'v18.0',
        });
        };

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

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

  const navigate = useNavigate();
  const handleEditClick = () => {
        navigate(`/leaderedit/${slug}`);
  };
  const renderClaimPage = () => {
    const handleClaimClick = async () => {
        if (leaderData.email) {
            const [localPart, domain] = leaderData.email.split('@');
            const [domainname, extension] = domain.split('.');
            const firstChar = localPart.charAt(0);
            const lastChar = localPart.charAt(localPart.length - 1);
            const alertMessage = `An link to edit your profile is sent to ${firstChar}***${lastChar}@${domainname.charAt(0)}***${domainname.charAt(domainname.length-1)}.${extension}`;
            alert(alertMessage);
        }

        const text = CLAIM_EMAIL_MESSAGE(leaderData.name);
        const response = await axiosInstance.post('/api/sendEmail', { "to":leaderData.email, "subject":CLAIM_EMAIL_SUBJECT, text,"emailType":'claimPage' });
        console.log(response.data.message);
        return true;
    };
    
    if (leaderData && !leaderData.isClaimed) {
      return (
        <div className="claim-page"  style={{ cursor: 'pointer' }} onClick={handleClaimClick} >
          <span>Claim this page</span>
          <FontAwesomeIcon icon={faHandPointer} />
        </div>
      );
    }
    return null;
  };


    if (!leaderData) {
        return <div>Loading...</div>;  // Show a loading state while the data is being fetched
    }
    else{
        
    }
    return (
        <div>
        <div id="fb-root"></div>
          <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0&appId=613070123469614" nonce="d8Ebr9hC"></script>
        <div className="leader-page">
            <div className="profile-and-about">
                <div className="profile-container">
                    <div className="profile-pic-container">
                        <img src={currentProfilePic} alt="Profile" className="profile-pic" />
                    </div>
                    <p>{leaderData.statement}</p>
                    {renderClaimPage()}
                    {isLoggedIn && (
                        <button className="edit-button" style={{ cursor: 'pointer' }} onClick={handleEditClick} >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                    )}
                    
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
    </div>
    );
}

export default LeaderPage;
