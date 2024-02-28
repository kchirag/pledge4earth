import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostList from './PostList';


const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [language, setLanguage] = useState('English'); // Default language
    const [category, setCategory] = useState('awareness'); // Default category

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    useEffect(() => {
        // Assuming your API can filter posts by language and category
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts/{language}/{category}/web', {
                    params: { language, category }
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [language, category]); // This useEffect will run on component mount and whenever language or category changes

    return (
        <div>
            <h1>Latest Posts</h1>
            <label htmlFor="language">Language:</label>
            <select id="language" value={language} onChange={handleLanguageChange}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Bengali">Bengali</option>
                <option value="Marathi">Marathi</option>
            </select>
            <label htmlFor="category">Category:</label>
            <select id="category" value={category} onChange={handleCategoryChange}>
                <option value="awareness">awareness</option>
                <option value="policies">policies</option>
                <option value="reputation">reputation</option> {/* Fixed typo in "reputation" */}
                <option value="politics">politics</option>
            </select>
            <PostList posts={posts} />
        </div>
    );
};

export default PostsPage;
