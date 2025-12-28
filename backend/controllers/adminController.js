
import Blog from '../models/Blog.js';
import Club from '../models/Club.js';
import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';

export const allClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json({success:true,clubs});
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending clubs' });
  }
};

export const approveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    club.isApproved = true;
    await club.save();
    res.status(200).json({ message: 'Club approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve club' });
  }
};

export const rejectClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    await Club.findByIdAndDelete(req.params.clubId); // or set isRejected = true if you want to keep data
    res.status(200).json({ message: 'Club rejected and deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject club' });
  }
};

export const pendingClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isApproved: false });
    res.status(200).json({ 
      success: true,
      clubs: clubs 
    });
  } catch (error) {
    console.error("Error fetching pending clubs:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pending clubs' 
    });
  }
};

// --- BLOGS ---

export const allBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json( {
      success: true,
      blogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending blogs' });
  }
};

export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'approved';
    await blog.save();
    res.status(200).json({ success: true,message: 'Blog approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve blog' });
  }
};

export const rejectBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'rejected';
    await Blog.findByIdAndDelete(req.params.blogId);
   
    res.status(200).json({ message: 'Blog rejected  and deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject blog' });
  }
};

export const pendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'pending' });
    res.status(200).json({ 
      success: true,
      blogs: blogs 
    });
  } catch (error) {
    console.error("Error fetching pending blogs:", error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch pending blogs' 
    });
  }
};

export const analytics= async (req, res)=> {
  try {

    const stats = {
      totalStudents: await Student.countDocuments(),
      approvedClubs: await Club.countDocuments({isApproved: true}),
      pendingClubs: await Club.countDocuments({isApproved: false}),
      approvedBlogs: await Blog.countDocuments({status: 'approved'}),
      pendingBlogs: await Blog.countDocuments({status: 'pending'}),
    }
    res.status(200).json(stats);
  } catch(error)
  {
    res.status(500).json({message: 'Failed to get analytics'});
  }
};
export const resetAdminAccount = async (req, res) => {
  try {
    const { newEmail, newPassword } = req.body;

    if (!newEmail || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate admin email domain
    if (!newEmail.endsWith("@college.com")) {
      return res.status(400).json({
        message: "Admin email must end with @college.com",
      });
    }

    const normalizedEmail = newEmail.toLowerCase().trim();

    // Delete ANY existing admin (any user with @college.com email)
    await Student.deleteMany({
      email: { $regex: /@college\.com$/i }
    });

    // Create new admin
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const newAdmin = await Student.create({
      name: "Admin",
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(200).json({
      success: true,
      message: "Admin reset successfully",
      admin: newAdmin,
    });

  } catch (error) {
    console.error("Reset admin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
