import React, { useState, useEffect } from "react";



function YoutubeFeed({ channelid }){
  const [videos, setVideos] = useState([]);
  //const [channelHandle, setChannelHandle] = useState("youtubecreators"); // Replace this with the handle of the channel you want to fetch videos from
  console.log(channelid);

  async function fetchRecentUploads(channelid) {
    const apiKey = process.env.REACT_APP_YOUTUBE_APIKEY;

    const response = await fetch(
        `https://yt.lemnoslife.com/channels?handle=@Lead4_Earth${channelid}`
      );
    const data = await response.json();

    const channelId = data.items[0].id;
    const response2 = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&key=${apiKey}`
      );
    const data2 = await response2.json();

    setVideos(data2.items);
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
        videos
        .filter(video => video.id.kind === "youtube#video") 
        .map(video => (
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