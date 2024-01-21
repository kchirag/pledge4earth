import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './PostList';

const PostsPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/api/posts/latest')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    return (
        <div>
            <h1>Latest Posts</h1>
            <PostList posts={posts} />
        </div>
    );
};

export default PostsPage;
