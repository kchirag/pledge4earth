import React, { useState } from 'react';
import './ShareBar.css';

function ShareBar() {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent('Check out this awesome website!');

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  const shareTextOptions = [
    'Our voice holds weight when our leader understands we stand united. As more and more people come together, driven by a love for our planet, leaders will be inspired to take action and prioritize eco-friendly policies',
    "Our thoughts gain importance when our leader realizes we're backed by many.",
    'Our perspective becomes significant as our leader sees our collective strength.',
  ];
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedShareText, setSelectedShareText] = useState(shareTextOptions[0]);
  const storedName = localStorage.getItem('userName');
  //setUserName(storedName);
  const subject = "Think green, talk green, and let's make a scene!";
  
  const handleEmailShare = (e) => {
    e.preventDefault();
    const mailto = `mailto:${userEmail}?subject=${encodeURIComponent(`${storedName} says: ${subject}`)}&body=${encodeURIComponent(`${selectedShareText} ${shareUrl}`)}`;
    window.location.href = mailto;
    setShowEmailModal(false);
  };



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
      <button onClick={() => setShowEmailModal(true)}>Share via Email</button>
      {showEmailModal && (
        <div className="email-modal">
          <h2>Share via Email</h2>
          <form onSubmit={handleEmailShare}>
            <label>
              Recepient Name:
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </label>
            <label>
              Recipient's Email:
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Share Text:
              <select
                value={selectedShareText}
                onChange={(e) => setSelectedShareText(e.target.value)}
              >
                {shareTextOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Send Email</button>
            <button onClick={() => setShowEmailModal(false)}>Cancel</button>
          </form>
        </div>
      )}
      
      {/* The rest of the share buttons */}
    </div>
  );
}

export default ShareBar;
