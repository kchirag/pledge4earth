import React, { useState, useEffect } from "react";



function YoutubeFeed({ channelid }){
  const [videos, setVideos] = useState([]);
  console.log(channelid);

  async function fetchRecentUploads(channelid) {
    const apiKey = process.env.REACT_APP_YOUTUBE_APIKEY;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelid}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.items;
  }

  useEffect(() => {
    async function fetchAndSetVideos() {
      const uploads = await fetchRecentUploads(channelid);
      setVideos(uploads);
    }

    fetchAndSetVideos();
  }, [channelid]);

  return (
    <div>
	 {videos && videos.length > 0 ? (
        videos.map(video => (
          <iframe
            key={video.id.videoId}
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            title={video.snippet.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default YoutubeFeed;