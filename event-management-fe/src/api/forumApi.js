import axios from './axios';

const forumApi = {
  // Create a new forum post
  createPost: (postData) => {
    return axios.post('/forum/posts/create', postData);
  },

  // Add a comment to a forum post
  addComment: (commentData) => {
    return axios.post('/forum/comments/add', commentData);
  },

  // Get all forum posts for an event
  getEventPosts: (eventId) => {
    return axios.get(`/forum/posts/event/${eventId}`);
  },

  // Get a specific forum post with its comments
  getPostWithComments: (postId) => {
    return axios.get(`/forum/posts/${postId}`);
  }
};

export default forumApi;
