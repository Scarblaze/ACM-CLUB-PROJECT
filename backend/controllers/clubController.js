import Club from "../models/Club.js";
import Blog from "../models/Blog.js";

import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";

import { deleteImage } from '../utils/cloudinary.js';

export const getblog=async(req,res)=>{
  try{
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    res.status(200).json(blog);
  }catch(err)
  {
    console.error('Error fetching blog  info:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    if(!title|| !description)
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
    
      authorType: 'Club',
      clubId: req.club._id,
      section: 'Club',
      status: 'approved', // club blogs are auto-approved
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: newBlog,
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
// Controller to fetch blogs for the club 

export const getClubBlogs = async (req, res) => {
  try {
    const clubId = req.club._id;

    const blogs = await Blog.find({ clubId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error('Error fetching club blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch club blogs',
      error: error.message,
    });
  }
};

// 2. Update Profile Photo
export const updateClubProfilePhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No image uploaded' });

    // Delete old photo if exists
    if (req.club.photo) {
      await deleteImage(req.club.photo);
    }

    req.club.photo = file.path;
    await req.club.save();
    res.json({ message: 'Profile photo updated', photo: file.path });
  } catch (error) {
    res.status(500).json({ message: 'Error updating photo' });
  }
};
// 3. Add Council Member
export const addCouncilMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    const file = req.file;

    if (!name || !role || !file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    req.club.clubCouncil.push({
      name,
      role,
      profilepic: file.path,
    });

    await req.club.save();
    res.json({ message: 'Council member added successfully', clubCouncil: req.club.clubCouncil });
  } catch (error) {
    res.status(500).json({ message: 'Error adding council member' });
  }
};

// 4. Update Existing Council Member (based on id )
export const updateCouncilMember = async (req, res) => {
  try {
    const {  name } = req.body;
    const { memberId } = req.params;
  

    const member = req.club.clubCouncil.id(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Council member not found' });
    }

    if (name) member.name = name;

    

    await req.club.save();
    res.json({ message: 'Council member updated', member });
  } catch (error) {
    res.status(500).json({ message: 'Error updating council member' });
  }
};

export const updateCouncilMemberPhoto = async (req, res) => {
  try {
    
    const { memberId } = req.params;
    const file = req.file;

    const member = req.club.clubCouncil.id(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Council member not found' });
    }

   

    if (file) {
      if (member.profilepic) await deleteImage(member.profilepic);
      member.profilepic = file.path;
    }

    await req.club.save();
    res.json({ message: 'Council member updated', member });
  } catch (error) {
    res.status(500).json({ message: 'Error updating council member' });
  }
};

// 5. Change Password
export const changeClubPassword = async (req, res) => {
  try {
    const clubId = req.club._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, club.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    club.password = hashedPassword;

    await club.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password' });
  }
};
export const deleteCouncilMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = req.club.clubCouncil.id(memberId);
    if (!member) return res.status(404).json({ message: 'Council member not found' });

    if (member.profilepic) await deleteImage(member.profilepic);

    member.deleteOne(); // remove the subdocument
    await req.club.save();

    res.json({ message: 'Council member deleted', clubCouncil: req.club.clubCouncil });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting council member' });
  }
};
export const getClubInfo = async (req, res) => {
  try {
    const clubId = req.club._id;

    const club = await Club.findById(clubId).select('-password');

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.status(200).json(club);
  } catch (error) {
    console.error('Error fetching club info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// club controller is done completely

// controllers/clubController.js


export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const clubId = req.user._id; // or wherever you get the club/user ID

    // 1. Fetch club/user record
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    // 2. Verify current password
    const match = await bcrypt.compare(currentPassword, club.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 3. Hash & update new password
    const salt = await bcrypt.genSalt(10);
    club.passwordHash = await bcrypt.hash(newPassword, salt);
    await club.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateClubDescription = async(req, res)=>{
  try{
    const clubId= req.club._id;
    const {description}= req.body;

    if(typeof description !== "string"){
      return res.status(400).json({message: "Invalid Description"});

    }

    const updated= await Club.findByIdAndUpdate(
      clubId,
      {description},
      { new: true, runValidators: true}
    );

    if(!updated)
    {
      return res.status(400).json({message: "Club not found"});
    }

    res.status(200).json({
      message: "Description updated successfully",
      description: updated.description,
    });

  } catch(err)
  {
    console.error("Error in updateDescription:", err);
    res.status(500).json({ message: "Server error" });
  }
}
