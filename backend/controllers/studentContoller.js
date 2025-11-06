import Student from '../models/Student.js';
import Blog from '../models/Blog.js';
import cloudinary from 'cloudinary';
import Club from '../models/Club.js'
import bcrypt from "bcryptjs";

//  Logout Student
export const logoutStudent = (req, res) => {
  res.cookie('token', '', { maxAge: 1 });
  res.status(200).json({ message: 'Logged out successfully' });
};

// 1. Get all approved clubs
export const getAllApprovedClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ isApproved: true }).select('-password');
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clubs' });
  }
};
// populate them according to new date 
// 2. Get all blogs of a particular club
export const getallblogs = async (req, res) => {
  try {
   
    const blogs = await Blog.find({  status: 'approved'}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch club blogs' });
  }
};
export const getclubprofile=async(req,res)=>{
  try{
    const { clubId } = req.params; 
    const club = await Club.findById(clubId).select('-password');

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.status(200).json(club);
  }catch(err)
  {
    res.status(500).json({ message: 'Failed to fetch club info ' });
  }
}

// 3. Get blogs based on section
export const getBlogsBySection = async (req, res) => {
  try {
    const { section } = req.params;

    const validSections = ["Intern", "Academic Resources", "Tech Stacks", "Experience", "Club"];
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: "Invalid blog section" });
    }

    const blogs = await Blog.find({ section, status: "approved" })
      .sort({ createdAt: -1 })
     

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch section blogs' });
  }
};

// 4. Update profile (name or photo)
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const { name } = req.body;

    if (name) student.name = name;

    if (req.file) {
      // Delete old image if exists
      if (student.profilePic) {
        const publicId = student.profilePic.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`collegeBlogs/${publicId}`);
      }
      student.profilePic = req.file.path;
    }
    
    await student.save();
    res.status(200).json({ message: 'Profile updated', student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const changeStudentPassword = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log("Current:", currentPassword);
    console.log("Student Hashed Password:", student.password);

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Error in changeStudentPassword:", error);
    return res.status(500).json({ message: 'Error changing password' });
  }
};


// 5. Get liked blogs
export const getLikedBlogs = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).populate({
      path: 'likedBlogs',
      match: { status: 'approved' },
    });
    res.status(200).json(student.likedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch liked blogs' });
  }
};

// 6. Get student info
export const getStudentInfo = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password');
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student info' });
  }
};
// 7. Like or Unlike a blog
export const likeOrUnlikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    const student = await Student.findById(req.student._id);
    const hasLiked = blog.likes.includes(student._id);

    if (!hasLiked) {
      blog.likes.push(student._id);
      student.likedBlogs.push(blog._id);
      await blog.save();
      await student.save();
      return res.status(200).json({ message: 'Blog liked' });
    } else {
      blog.likes = blog.likes.filter(id => id.toString() !== student._id.toString());
      student.likedBlogs = student.likedBlogs.filter(id => id.toString() !== blog._id.toString());
      await blog.save();
      await student.save();
      return res.status(200).json({ message: 'Blog unliked' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error liking/unliking blog' });
  }
};

// 8. Comment on a blog
export const commentOnBlog = async (req, res) => {
  try {

    const { blogId } = req.params;
    
    const  {comment}  = req.body;
     
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.push({
      student: req.student._id,
      comment
    });

    await blog.save();
    res.status(200).json({ message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, description,section } = req.body;
    if(!title|| !description||!section)
      {
        return res.status(400).json({ message: ' Complete details are  missing ' });
      }

    const coverimg = req.files['coverimg']?.[0]?.path || null;
    const photos = req.files['photos']?.map((file) => file.path) || [];
    
    if (!coverimg) {
      return res.status(400).json({ message: 'Cover image is required' });
    }
   

    const newBlog = await Blog.create({
      title,
      description,
      coverimg,
      photos,
    
      section: section,
      authorType: 'Student',
      studentId:req.student._id,
      
      status: 'pending', 
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
     
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message,
    });
  }
};
