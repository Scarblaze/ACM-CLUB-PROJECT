
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const apiUrl = "https://acm-club-project-backend.onrender.com";

export const fetchComments = createAsyncThunk(
  'comments/get_all_comments', 
  async (blogID, { rejectWithValue }) => {
    try {

      const response = await axios.get(`${apiUrl}/api/club/blogs/comments/get-all-comments/${blogID}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ blogID, content, userType }, { rejectWithValue }) => {
    try {
      const URLauthorType = userType === 'student' ? `${apiUrl}/api/club/blogs/comments/add/student` : `${apiUrl}/api/club/blogs/comments/add/club`;
      const response = await axios.post(URLauthorType, { blogID, content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    commentArray: [],
    commentLoading: false,
    commentError: null,
  },
  reducers: {
    clearComments: (state) => {
      state.commentArray = [];
      state.commentError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.commentArray = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.commentLoading = true;
        state.commentError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        state.commentArray.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.commentError = action.payload;
      });
  },
});

export const { clearComments } = commentsSlice.actions;

export default commentsSlice.reducer;
