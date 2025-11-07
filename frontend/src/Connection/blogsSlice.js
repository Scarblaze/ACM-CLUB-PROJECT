//CONNECTIONS FOLDER NOT USED IN THE PROGRAM

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const apiUrl = "https://acm-club-project-backend.onrender.com";

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs',
    async ( { rejectWithValue }) => {
        try {
            const response = await axios.get(`${apiUrl}/api/club/blogs`);
            return response.data;
        } 
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch blogs');
        }
    }
);

export const addBlog = createAsyncThunk(
  'blogs/addBlog',
  async ({ title, description, section, files, userType }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('section', section);
      files.forEach((file) => formData.append('files', file));

      const response = await axios.post(`${apiUrl}/api/club/create-blog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          userType,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add blog');
    }
  }
);

export const fetchPendingBlogs = createAsyncThunk(
  'blogs/fetchPendingBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/api/club/pending-blogs`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending blogs');
    }
  }
);

export const approveBlog = createAsyncThunk(
  'blogs/approveBlog',
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/api/club/approve-blog/${blogId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve blog');
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogArray: [],
    blogLoading: false,
    blogError: null,
  },
  reducers: {
    clearBlogs: (state) => {
      state.blogArray = [];
      state.blogError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.blogLoading = true;
        state.blogError = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.blogLoading = false;
        state.blogArray = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.blogLoading = false;
        state.blogError = action.payload;
      })
      .addCase(addBlog.pending, (state) => {
        state.blogLoading = true;
        state.blogError = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogLoading = false;
        state.blogArray.push(action.payload);
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.blogLoading = false;
        state.blogError = action.payload;
      });
  },
});

export const { clearBlogs } = blogsSlice.actions;

export default blogsSlice.reducer;
