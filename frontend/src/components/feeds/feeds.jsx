import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Feeds() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/posts', {
        post_title: newPost,
        user_id: userId,
      });
      
      if (response.status === 200) {
        setNewPost('');
        fetchPosts();
      } else {
        console.error('Error creating post:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div style={{margin: '2em'}}>
      <h2>Create Post</h2>
      <form onSubmit={handlePostCreate}>
        <input
          type="text"
          placeholder="New Post"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>

      <h2>All Posts</h2>
      {posts.map((post) => (
        <div style={{border: '2px solid black', margin: '2em', padding: '2em', width: 'fit-content'}} key={post.id}>
          <h3>{post.post_title}</h3>
          <p>Posted by: {post.username}</p>
          <p>Date: {post.date}</p>
        </div>
      ))}
    </div>
  );
}

export default Feeds;
