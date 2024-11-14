interface CommentData {
  body: string;
  email: string;
  name: string;
}

interface Post {
  title: string;
  body: string;
  userId: number;
}

interface PostResponse {
  userId: number;
  id: number;
  title: string;
  body: string;
}

import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

export const PostsService = {
  getPosts: () => api.get('/posts'),
  getPost: async (id: number) => {
    const response = await api.get<PostResponse>(`/posts/${id}`);
    return {
      ...response,
      data: {
        ...response.data,
        content: response.data.body
      }
    };
  },
  getComments: (postId: number) => api.get(`/posts/${postId}/comments`),
  createPost: (post: Post) => api.post('/posts', post),
  createComment: (postId: number, comment: CommentData) => 
    api.post(`/posts/${postId}/comments`, comment)
};

export const UsersService = {
  getUser: (userId: number) => api.get(`/users/${userId}`),
  getUserPosts: (userId: number) => api.get(`/users/${userId}/posts`)
}; 