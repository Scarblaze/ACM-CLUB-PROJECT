# 🎓 College Connect

**College Connect** is a MERN stack platform designed to bridge the gap between students and clubs in a college. It provides a space for students to explore extracurricular opportunities, access academic guidance, and share their own experiences.

## 🚀 Features

### 👤 Authentication
- Login as **Student** or **Club**
- Role-based access and dashboard

### 🏫 Clubs
- View list of all registered clubs
- Access club details, members, and event history
- Clubs can:
  - Post upcoming events in the form of blogs
  - View engagement (likes, comments) from students

### 📚 Students
- Discover all clubs and their events
- Interact with club blogs (like, comment)
- Post their own blogs in 4 dedicated categories:
  1. 🎯 **Placement/Internship Guidance**
  2. 🏆 **Hackathon & Competition Experience**
  3. 📖 **Academic Resources & CGPA Tips**
  4. 🛠️ **Tech Stacks & Learning Paths**

### 📝 Blog System
- Like, comment on blogs
- Role-based permissions (student and club authorship)
- Filter by category or author

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React
- Tailwind CSS
- Axios for API communication

### 🔹 Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer + Cloudinary (for profile images/blog images)

---

## 🔒 Authentication & Authorization

- Secure login with JWT
- Protected routes based on user type (`student`, `club`)
- Password hashing using `bcrypt`

---

### Future Enhancements
- Email notifications for blog replies or event reminders
- Chat rooms for students to talk to each other

