import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from './commentsSlice';
import blogsReducer from './blogsSlice';
import likedPostsReducer from './likedPostsSlice';
import savedPostsReducer from './savedPostsSlice';

export default configureStore({
  reducer: {
    comments: commentsReducer,
    blogs: blogsReducer,
    likedPosts: likedPostsReducer,
    savedPosts: savedPostsReducer,
  },
});
