//FaqsContainer.js
import React from 'react';
import FeedbackFormContainer from './FeedbackFormContainer'

const FaqsContainer = () => {
  return (
    <div className="about-container">
      <h2>FAQ's</h2>
      <h3>Why Seek Clear Opinion?</h3>
      <p>
  		We urge individuals to express their viewpoints with clarity. As more neighbors join the chuckle train, our local leaders will feel a tickle to clarify their standpoints and make rib-tickling statements!
  	  </p>
  	  <h3>How Do We Use Your Email Address?</h3>
  	  <p>We gather email addresses solely for verification purposes. Plus, when you share it with friends or your leader, we'll give you a heads-up when the leader you nudged to pledge actually signs the pledge.</p>
      <h3>Should I use my real name?</h3>
      <p>We recommend using real name but its also not a mandatory requirement, while giving your name your view will be public</p>
      <h3>Is my data secured?</h3>
      <p>The code of the site is opensource and we follow all the industry practices of ensuring that the email address is not leaked</p>
      <h3>What data do you collect?</h3>
      <p>We do not keep any log of IP addresses to ensure that it would not be tracked back to the user</p>
    </div>
  );
};

export default FaqsContainer;