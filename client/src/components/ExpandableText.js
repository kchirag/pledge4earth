import React, { useState } from 'react';

const ExpandableText = ({ maxLength, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedText = children.substr(0, maxLength) + '...';

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? children : truncatedText}
      <button onClick={toggleExpanded}>
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </>
  );
};

export default ExpandableText;
