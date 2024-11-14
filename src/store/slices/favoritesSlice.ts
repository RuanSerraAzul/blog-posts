import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  ids: number[];
  loading: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  loading: false
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
      state.loading = false;
      AsyncStorage.setItem('@favorites', JSON.stringify(action.payload));
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      const index = state.ids.indexOf(postId);
      if (index === -1) {
        state.ids.push(postId);
      } else {
        state.ids.splice(index, 1);
      }
      AsyncStorage.setItem('@favorites', JSON.stringify(state.ids));
    }
  }
});

export const { setFavorites, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer; 