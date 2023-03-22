import React from 'react';

const NewsContainer = () => {
  return (
    <div className="news-container">
      <h2>Environmental News</h2>
      {/* Static data to be changed later */}
      
      <p>Voters Guide for Environment and Sustainability</p>
      <ul>
          <li>City Council Dist 2 — Sara Lashanlo ....5 miles away</li>
          <li>City Council Dist 4 – Marisol Rubio ....7 miles away </li>
          <li>Mayor(San Ramon) – Sabina Zafar ....1 mile away</li>
          <li>County Representative Xyz ......20 Miles away </li>
      </ul>
      <p> Prepared by <b>Costa County Climate Leaders (4CL)</b></p>
    </div>
  );
};

export default NewsContainer;
