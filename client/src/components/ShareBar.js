import React, { useState } from 'react';
import './ShareBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import axiosInstance from '../axiosInstance';


function ShareBar() {
  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Our thoughts gain importance when our leader realizes we're backed by many.!`);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const [customReason, setCustomReason] = useState("");


  const shareTextOptionsinp = [
    'Our voice holds weight when our leader understands we stand united. As more and more people come together, driven by a love for our planet, leaders will be inspired to take action and prioritize eco-friendly policies',
    "Our thoughts gain importance when our leader realizes we're backed by many.",
    'Our perspective becomes significant as our leader sees our collective strength.',
  ];
  const [shareTextOptions, setShareTextOptions] = useState(shareTextOptionsinp);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [senderName, setSenderName] = useState(localStorage.getItem('userName'));
  const [senderEmail, setSenderEmail] = useState(localStorage.getItem('userEmail'));
  const [recepientName, setRecepientName] = useState('');
  const [recepientEmail, setRecepientEmail] = useState('');
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const [isLeaderOrgoAll, setIsLeaderOrgoAll ] = useState(2);
  const [selectedShareText, setSelectedShareText] = useState(shareTextOptions[0]);
//  const [subject, setSubject] = useState(`"Think green, talk green, and let's make a scene!"`);
  //const [isLeaderOrgoAll, setIsLeaderOrgoAll] = useState(0);
  //const [shareTextOptions, setShareTextOptions] = useState(leaderTextOptions);
  const [shareCount, setShareCount] = useState({ facebook: 0, twitter: 0, linkedin: 0 });

  const handleClick = (platform) => {
    setShareCount({ ...shareCount, [platform]: shareCount[platform] + 1 });
  };


  const storedName = localStorage.getItem('userName');
  //setSenderName(storedName);
  //const subject = "Think green, talk green, and let's make a scene!";
  
  const handleEmailShare = async (e) => {
    e.preventDefault();
    //Set parameters
    //const qrystring = "to=" + recepientEmail + "&recepient=" + recepientName + "&invitor=" + senderName + "&senderEmail=" + senderEmail + "&message=" + selectedShareText
    const message = customReason.trim() === ''? selectedShareText : customReason;

    try {
      //console.log(qrystring);
      await axiosInstance.get('/sendInvite', {params:{ recepientEmail, recepientName, senderName, senderEmail, isLeaderOrgoAll, message }});
      //console.log(response.data.message);
      //return true;
    } catch (error) {
      console.error('Error sending email:', error);
      //return false;
    }

    setShowEmailModal(false);
  };


  const handleCustomReasonSelection = () => {
    setSelectedShareText(customReason);
    setCustomReason(customReason);
  };
  const handleCustomReasonChange = (event) => {
    console.log(event.target.value);
    setCustomReason(event.target.value);
  };


  const HandleReasonList = (e) => {
    //console.log("TEst");
    if (e.target.value === 'Leader') {
      setIsLeaderOrgoAll(0);
      //const finalmessage = recepientName ==='' ? LEADER_MESSAGE : LEADER_MESSAGE.replace("[Name]", recepientName)
      //setShareTextOptions([finalmessage]);
    } else if (e.target.value === 'Organization') {
      setIsLeaderOrgoAll(1);
      //const finalmessage = recepientName ==='' ? ORG_MESSAGE : LEADER_MESSAGE.replace("[Name]", recepientName)
      //setShareTextOptions([finalmessage]);
    } else {
      setIsLeaderOrgoAll(2);
      //setShareTextOptions(shareTextOptionsinp);
    }
    /*if(event.target.value === "Leader"){
      setIsLeaderOrgoAll(0);
    }
    else if(event.target.value === "Organization"){
     setIsLeaderOrgoAll(1); 
    }
    else{
     setIsLeaderOrgoAll(2); 
    }*/
    //console.log(event.target.value);
  };

  return (
    <div className="share-bar">
     <button className="share-button" onClick={() => setShowEmailModal(true)}>Share via Email</button>
      {showEmailModal && (
        <div className="email-modal">
          <h2>Share via Email</h2>
          <form onSubmit={handleEmailShare}>
            <label>
              Recepient's Name:
              <input
                type="text"
                value={recepientName}
                onChange={(e) => setRecepientName(e.target.value)}
                required
              />
            </label>
            <label>
              Recipient's Email:
              <input
                type="email"
                value={recepientEmail}
                onChange={(e) => setRecepientEmail(e.target.value)}
                required
              />
            </label>
            <div>
              <label>
                Your Name:
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
              </label>
              <label>
                Your Email:
                <input
                  type="text"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                />
                <span className="smallprint">(to notify you).</span>
              </label>              
              <label>
                Share Anonymously:
                <input
                  type="checkbox"
                  checked={sendAnonymously}
                  onChange={(e) => {setSendAnonymously(e.target.checked); setSenderName('');}}
                />
              </label>
            </div>
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
            <div>Personal Note</div>
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
                    placeholder="Type your own message..."
                    value={customReason}
                    onChange={handleCustomReasonChange}
                  />

                </li>
              
            </ul>
            <button type="submit">Send Email</button>
            <button onClick={() => setShowEmailModal(false)}>Cancel</button>
          </form>
        </div>

      )}
      
      
          <a
            className="share-button"
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick('facebook')}
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
          <a
            className="share-button"
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick('twitter')}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            className="share-button"
            href={linkedinShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick('linkedin')}
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          

    </div>
  );
}

export default ShareBar;
