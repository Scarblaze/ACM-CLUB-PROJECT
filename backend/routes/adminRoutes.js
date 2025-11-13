
import express from 'express';

import { isAdmin } from '../middlewares/authMiddleware.js';

import {
 
  approveClub,
  rejectClub,
  approveBlog,
  rejectBlog,
  allClubs,
  allBlogs,
  analytics,
  pendingClubs,
  pendingBlogs,
  resetAdminAccount
} from "../controllers/adminController.js";
const router = express.Router();
// Middleware: Student must be admin
// CLUB ROUTES
router.get('/all-clubs', isAdmin, allClubs);
router.put('/approve-club/:clubId', isAdmin, approveClub);
router.put('/reject-club/:clubId', isAdmin, rejectClub);
router.get('/pending-clubs', isAdmin, pendingClubs);

// BLOG ROUTES
router.get('/all-blogs', isAdmin, allBlogs);
router.put('/approve-blog/:blogId', isAdmin, approveBlog);
router.put('/reject-blog/:blogId', isAdmin, rejectBlog);
router.get('/analytics', isAdmin, analytics);
router.get('/pending-blogs', isAdmin, pendingBlogs);

router.post('/reset-admin', isAdmin, resetAdminAccount);


export default router;