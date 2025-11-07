

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const apiBaseUrl = "https://acm-club-project-backend.onrender.com";

export const fetchLikedPosts = createAsyncThunk(
  'likedPosts/fetchLikedPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/api/students/liked`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch liked posts');
    }
  }
);

export const likePost = createAsyncThunk(
  'likedPosts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/students/like/${postId}`);
      return response.data; // Assuming the API returns the updated post
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'likedPosts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/students/unlike/${postId}`);
      return response.data; // Assuming the API returns the updated post
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

const likedPostsSlice = createSlice({
  name: 'likedPosts',
  initialState: {
    likedPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLikedPosts: (state) => {
      state.likedPosts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.likedPosts = action.payload;
      })
      .addCase(fetchLikedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.likedPosts.push(action.payload);
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.likedPosts = state.likedPosts.filter(
          (post) => post._id !== action.payload._id
        );
      });
  },
});

export const { clearLikedPosts } = likedPostsSlice.actions;

export default likedPostsSlice.reducer;
