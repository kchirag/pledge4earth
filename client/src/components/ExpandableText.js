import React, { useState } from 'react';
import '../App.css'

const ExpandableText = ({ maxLength, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedText = children.substr(0, maxLength) + '...';

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? children : truncatedText}
      <button onClick={toggleExpanded} className="read-more-button">
        {isExpanded ? 'less' : 'more'}
      </button>
    </>
  );
};

export default ExpandableText;
