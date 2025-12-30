import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import clubRoutes  from './routes/clubRoutes.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Middleware

app.use(cookieParser());
app.use(cors({
   origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json()); // <--- This is important to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Optional, for form data
let isConnected = false;
async function connectToDatabase() {
   try{
     await mongoose.connect(process.env.MONGO_URI);
     isConnected = true;
     console.log('MongoDB connected');
   } catch (error) {
     console.error('Error connecting to MongoDB:', error);
   }
}

app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToDatabase();
  }
  next();
});



app.use('/api/auth', authRoutes);
app.use('/api/student',studentRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/club',clubRoutes);

export default app;

