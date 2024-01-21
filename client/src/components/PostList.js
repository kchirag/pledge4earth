import React from 'react';

const PostList = ({ posts }) => {
    if (!posts.length) {
        return <div>No posts available</div>;
    }

    return (
        <div>
            {posts.map(post => (
                <div key={post._id} className="post">
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
