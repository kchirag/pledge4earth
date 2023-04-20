//components/PrivacyPolicyContainer.js

import React from 'react';
import {PRIVACY_POLICY} from '../constant';

const PrivacyPolicyContainer = () => {
  return (
    <div className="textcontent-container" dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY }}>
      
    </div>
  );
};

export default PrivacyPolicyContainer;

