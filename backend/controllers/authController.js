import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Club from '../models/Club.js';
import generateToken from '../utils/generateToken.js';

// ------------------------ Student + Admin -----------------------

export const registerStudent = async (req, res) => {
  const { name,password, email } = req.body;

  try {
   
    const userExists = await Student.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Student already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    let photo = "";
    if (req.file) {
      photo= req.file.path; // cloudinary URL from multer-storage-cloudinary
    }

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      profilePic : photo,
    });

    generateToken(res, student._id, 'student');
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const isAdminEmail = normalizedEmail.endsWith("@college.com");

    // ============== ADMIN LOGIN / CREATE ADMIN ==============
    if (isAdminEmail) {
      // Check if there is already an admin
      let admin = await Student.findOne({ email: normalizedEmail });

      // Create admin if not found
      if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 10);

        admin = await Student.create({
          name: "Admin",
          email: normalizedEmail,
          password: hashedPassword,
        });

        generateToken(res, admin._id, "admin");

        return res.status(201).json({
          message: "Admin created & logged in successfully",
          isAdmin: true,
          admin,
        });
      }

      // Admin exists → check password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid admin password" });
      }

      generateToken(res, admin._id, "admin");

      return res.status(200).json({
        message: "Admin login successful",
        isAdmin: true,
        admin,
      });
    }

    // ============== STUDENT LOGIN (NO AUTO-CREATE) ==============
    const student = await Student.findOne({ email: normalizedEmail });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, student._id, "student");

    return res.status(200).json({
      message: "Student login successful",
      student,
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// -------------------------- Club -------------------------------
export const registerClub = async (req, res) => {
  const { name, password, description } = req.body;

  try {
   
    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ message: "Club already exists" });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);
   
    let clubPhoto = "";
    if (req.file) {
      clubPhoto = req.file.path; // multer-storage-cloudinary gives the cloud URL here
    }
  
    const club = await Club.create({
      name,
      password: hashedPassword,
      description,
      photo: clubPhoto, 
    });
   
    generateToken(res, club._id, "club");

    res.status(201).json({
      message: "Club registered successfully",
      club,
    });
  } catch (err) {
    console.log("5");
    console.error("Error in club registration:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const loginClub = async (req, res) => {
  const { name, password } = req.body;

  try {
    const club = await Club.findOne({ name });
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isMatch = await bcrypt.compare(password, club.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    generateToken(res, club._id, 'club');
    res.status(200).json({ message: 'Club login success', club });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const logoutUser = async (req, res) => {
  try {
    console.log("inside");
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax", // Or "None" for cross-site cookies with HTTPS
        secure: process.env.NODE_ENV === "production", // true in production
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Server error during logout" });
  }
};

export default logoutUser;


