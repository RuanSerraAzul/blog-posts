import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types';

interface PostsState {
  items: Post[];
  loading: boolean;
  error: string | null;
  localPosts: Post[];
}

const initialState: PostsState = {
  items: [],
  loading: false,
  error: null,
  localPosts: []
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.items = [...state.localPosts, ...action.payload];
      state.loading = false;
      state.error = null;
    },
    addLocalPost: (state, action: PayloadAction<Post>) => {
      state.localPosts.unshift(action.payload);
      state.items = [...state.localPosts, ...state.items];
    },
    removeLocalPost: (state, action: PayloadAction<number>) => {
      state.localPosts = state.localPosts.filter(post => post.id !== action.payload);
      state.items = state.items.filter(post => post.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { setPosts, addLocalPost, removeLocalPost, setLoading, setError } = postsSlice.actions;
export default postsSlice.reducer; 