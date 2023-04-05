import React, { useState } from 'react';
import './ShareBar.css';

function ShareBar() {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent('Check out this awesome website!');

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  // const [showEmailModal, setShowEmailModal] = useState(false);
  // const [userName, setUserName] = useState('');
  // const [userEmail, setUserEmail] = useState('');
  // const [selectedShareText, setSelectedShareText] = useState(shareTextOptions[0]);


  return (
    <div className="share-bar">
      <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
        Share on Facebook
      </a>
      <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
        Share on Twitter
      </a>
      <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer">
        Share on LinkedIn
      </a>
    </div>
  );
}

export default ShareBar;
