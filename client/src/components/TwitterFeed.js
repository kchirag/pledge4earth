//TwitterFeed

import React, { useEffect } from 'react';

function TwitterFeed({twitterid}) {

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    document.body.appendChild(script);
    console.log("invoked");

    return () => {
      //document.body.removeChild(script);
    };
  }, [twitterid]);

  return (
    <div>
      <a className="twitter-timeline" href="https://twitter.com/{twitterid}?ref_src=twsrc%5Etfw">Tweets by {twitterid}</a>
    </div>
  );
}

export default TwitterFeed;
