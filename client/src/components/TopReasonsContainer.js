import React, { useState, useEffect } from 'react';
import ReasonSlider from './ReasonSlider';

function TopReasonsContainer() {
  const [topReasons, setTopReasons] = useState([]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const reasons = await fetchTopReasons();
  //     setTopReasons(reasons);
  //   }

  //   fetchData();
  // }, []);

  return (
    <div className="top-reasons-container">
      <ReasonSlider reasons={} />
    </div>
  );
}

export default TopReasonsContainer;
