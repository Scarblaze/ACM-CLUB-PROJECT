

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const apiUrl = ""https://acm-club-project-backend.onrender.com"";
export const fetchSavedPosts = createAsyncThunk(
  'savedPosts/fetchSavedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('${apiUrl}/students/saved');
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch liked posts');
    }
  }
);

export const savePost = createAsyncThunk(
  'savedPosts/savePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/students/save/${postId}`);
      return response.data; // assumed the API returns the updated post
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unsavePost = createAsyncThunk(
  'unsavedPosts/unsavePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/students/unlike/${postId}`);
      return response.data; // Assuming the API returns the updated post
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

const savedPostsSlice = createSlice({
  name: 'savedPosts',
  initialState: {
    savedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSavedPosts: (state) => {
      state.savedPosts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.savedPosts = action.payload;
      })
      .addCase(fetchSavedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.savedPosts.push(action.payload);
      })
      .addCase(unsavePost.fulfilled, (state, action) => {
        state.savedPosts = state.likedPosts.filter(
          (post) => post._id !== action.payload._id
        );
      });
  },
});

export const { clearLikedPosts } = savedPostsSlice.actions;

export default savedPostsSlice.reducer;
