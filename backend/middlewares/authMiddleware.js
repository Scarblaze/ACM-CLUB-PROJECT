import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Club from '../models/Club.js';
                                                        

export const protectStudent = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id).select('-password');

    if (!student) return res.status(401).json({ message: 'Not authorized' });

    req.student = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

export const protectClub = async (req, res, next) => {
  try {

    const token = req.cookies.token;
    
    if (!token) return res.status(401).json({ message: 'Not authorized' });
         
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const club = await Club.findById(decoded.id).select('-password');

    if (!club) return res.status(401).json({ message: 'Not authorized' });

    req.club = club;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

export const isAdmin = (req, res, next) => {
   try{
    const token = req.cookies.token; // assuming you're storing the token in cookies

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, not an admin' });
    }

    // add decoded info to req.user if needed
    req.user = decoded;

    next(); // allow access
   } catch(err)
   {
    res.status(401).json({ message: 'Token invalid' });
   }
};
// done completely
