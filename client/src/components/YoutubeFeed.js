import React, { useState, useEffect } from "react";



function YoutubeFeed({ channelName,channelid }){
  const [videos, setVideos] = useState([]);
  //const [channelHandle, setChannelHandle] = useState("youtubecreators"); // Replace this with the handle of the channel you want to fetch videos from
  console.log(channelid + "," + channelName);

  async function fetchRecentUploads(channelName,channelid) {
    const apiKey = process.env.REACT_APP_YOUTUBE_APIKEY;
    console.log(channelName + "," + channelid);
    let data = {}
    if (!channelid){
      const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?q=${channelName}&key=${apiKey}`
        );
      data = await response.json();
    }
    console.log(channelid);
    const channelId = channelid  ? channelid: data.items[0].id.channelId;
    const response2 = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&key=${apiKey}`
      );
    const data2 = await response2.json();

    setVideos(data2.items);
    console.log(data2);
    return data2.items;
  }

  useEffect(() => {
    async function fetchAndSetVideos() {
      const uploads = await fetchRecentUploads(channelName, channelid);
      setVideos(uploads);
    }

    fetchAndSetVideos();
  }, []);

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