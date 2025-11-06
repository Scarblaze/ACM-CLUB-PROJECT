import express from 'express';
import {

  logoutStudent,
  getAllApprovedClubs,
  getallblogs,
  getBlogsBySection,
  updateStudentProfile,
  getLikedBlogs,
  getStudentInfo,
  likeOrUnlikeBlog,
  commentOnBlog,
  getclubprofile,createBlog,
  changeStudentPassword
  
} from '../controllers/studentContoller.js';

import { protectStudent } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multer.js';

const router = express.Router();
router.get('/clubs', protectStudent, getAllApprovedClubs);// done
router.get('/blogs', protectStudent, getallblogs);  
router.get('/clubs/:clubId/profile', protectStudent, getclubprofile);
router.get('/blogs/section/:section', protectStudent, getBlogsBySection);
router.put('/update-profile', protectStudent, upload.single('profilePic'), updateStudentProfile);
router.put('/change-password', protectStudent, changeStudentPassword);
router.get('/liked-blogs', protectStudent, getLikedBlogs);
router.get('/me', protectStudent, getStudentInfo);
router.post('/like/:blogId', protectStudent, likeOrUnlikeBlog);
router.post('/comment/:blogId', protectStudent, commentOnBlog);
router.post('/create-blog', upload.fields([
    { name: 'coverimg', maxCount: 1 },
    { name: 'photos', maxCount: 20 },
 
  ]),protectStudent,createBlog);

export default router;
