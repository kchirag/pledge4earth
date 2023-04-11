import React, { useState } from 'react';
import './ShareBar.css';

function ShareBar() {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Our thoughts gain importance when our leader realizes we're backed by many.!`);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const [customReason, setCustomReason] = useState("");


  const shareTextOptions = [
    'Our voice holds weight when our leader understands we stand united. As more and more people come together, driven by a love for our planet, leaders will be inspired to take action and prioritize eco-friendly policies',
    "Our thoughts gain importance when our leader realizes we're backed by many.",
    'Our perspective becomes significant as our leader sees our collective strength.',
  ];

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const [isLeaderOrgoAll, setIsLeaderOrgoAll ] = useState(2);
  const [selectedShareText, setSelectedShareText] = useState(shareTextOptions[0]);
  const [subject, setSubject] = useState(`"Think green, talk green, and let's make a scene!"`);


  const storedName = localStorage.getItem('userName');
  //setUserName(storedName);
  //const subject = "Think green, talk green, and let's make a scene!";
  
  const handleEmailShare = (e) => {
    e.preventDefault();
    const mailto = `mailto:${userEmail}?subject=${encodeURIComponent(`${storedName} says: ${subject}`)}&body=${encodeURIComponent(`${selectedShareText} ${shareUrl}`)}`;
    window.location.href = mailto;
    setShowEmailModal(false);
  };


  const handleCustomReasonSelection = () => {
    setSelectedShareText(customReason);
    setCustomReason(customReason);
  };
  const handleCustomReasonChange = (event) => {
    console.log(event.target.value);
    setCustomReason(event.target.value);
    //setSelectedShareText(event.target.value);
    //handleCustomReasonChange(event.target.value);
  };

  const HandleReasonList = (event) => {
    if(event.target.value === "Leader"){
      setIsLeaderOrgoAll(0);
    }
    else if(event.target.value === "Organization"){
     setIsLeaderOrgoAll(1); 
    }
    else{
     setIsLeaderOrgoAll(2); 
    }
    console.log(event.target.value);
  };

  return (
    <div className="share-bar">
      <a className="share-button" href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
        Share on Facebook
      </a>
      <a className="share-button" href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
        Share on Twitter
      </a>
      <a className="share-button" href={linkedinShareUrl} target="_blank" rel="noopener noreferrer">
        Share on LinkedIn
      </a>
      <button className="share-button" onClick={() => setShowEmailModal(true)}>Share via Email</button>
      {showEmailModal && (
        <div className="email-modal">
          <h2>Share via Email</h2>
          <form onSubmit={handleEmailShare}>
            <label>
              Recepient's Name:
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
            <div>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="leaderRadio"
                    name="leaderRadio"
                    value="Leader"
                    checked={ isLeaderOrgoAll === 0}
                    onChange={(e) => HandleReasonList(e)}
                  />
                  <label htmlFor="leaderRadio">Leader</label>
                </div>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="organizationRadio"
                    name="organizationRadio"
                    value="Organization"
                    checked={ isLeaderOrgoAll === 1 }
                    onChange={(e) => HandleReasonList(e)}
                  />
                  <label htmlFor="organizationRadio">Organization</label>
                </div>
                <div className="radio-group">
                  <input
                    type="radio"
                    id="allRadio"
                    value="all"
                    checked={ isLeaderOrgoAll===2}
                    onChange={(e) => HandleReasonList(e)}
                  />
                  <label htmlFor="allRadio">All</label>
                </div>
            </div>
            <ul className="reasons-list">
              {shareTextOptions.map((option, index) => (
                <li
                      key={index}
                      className={`reason-item${selectedShareText === option ? " selected" : ""}`}
                      onClick={() => setSelectedShareText(option)}
                    > {option}
                    </li>
                  ))}

                <li>
                  <input
                    type="text"
                    className="custom-reason-input"
                    placeholder="Type your own reason..."
                    value={customReason}
                    onChange={handleCustomReasonChange}
                  />

                </li>
              
            </ul>
            <div>
            <label>Subject</label>
              <input
                    type="text"
                    className="custom-reason-input"
                    placeholder="Invites your to share your views"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)} 
                />
            </div>
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
