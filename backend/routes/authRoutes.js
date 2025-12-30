import express from 'express';
import {
  registerStudent,
  loginStudent,
  registerClub,
  loginClub,
  logoutUser
} from '../controllers/authController.js';
import jwt from 'jsonwebtoken'
import upload from "../middlewares/multer.js";
const router = express.Router();

import Club from '../models/Club.js';
// Student & Admin
import Student from '../models/Student.js';
router.post('/student/register',upload.single("profilepic"),registerStudent);
router.post('/student/login', loginStudent);

// Club

router.post('/club/login', loginClub);
router.post("/club/register", upload.single("photo"), registerClub);
router.get("/logout", logoutUser); 
export default router;
