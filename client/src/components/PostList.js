import React from 'react';

const PostList = ({ posts }) => {
    if (!posts.length) {
        return <div>No posts available</div>;
    }
    const source = (mediaUrl) => {
        if (!mediaUrl) {
            return null;
        }

        if (mediaUrl.endsWith('.mp4')) {
            return <video controls src={mediaUrl} />;
        } else if (mediaUrl.includes('twitter.com')) {
            // Embed Twitter content
            // Actual embedding would require using Twitter's widgets.js
            return <a href={mediaUrl}>View Tweet</a>;
        } else if (mediaUrl.includes('facebook.com')) {
            // Embed Facebook content
            // Actual embedding would require using Facebook's JavaScript SDK
            return <a href={mediaUrl}>View on Facebook</a>;
        } else if (mediaUrl.includes('instagram.com')) {
            // Embed Instagram content
            // Actual embedding would require using Facebook's JavaScript SDK for Instagram
            return <a href={mediaUrl}>View on Instagram</a>;
        } else {
            return <img src={mediaUrl} alt="Post media" />;
        }
    };

    return (
        <div>
            {posts.map(post => (
                <div key={post._id} className="post">
                    <p>{source(post.url)}</p>
                    <p>{post.text}</p>
                    {post.media && post.media.map((mediaUrl, index) => (
                        // Assuming mediaUrl is the path to the media
                        <div key={index} className="media">
                            {mediaUrl.endsWith('.mp4') ? (
                                <video controls src={mediaUrl} />
                            ) : (
                                <img src={mediaUrl} alt={`Post media ${index}`} />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PostList;
