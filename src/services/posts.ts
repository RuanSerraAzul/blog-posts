import { api } from './api';
import { Post } from '../types/post';

export const PostsService = {
  getPosts: () => api.get<Post[]>('/posts'),
}; 