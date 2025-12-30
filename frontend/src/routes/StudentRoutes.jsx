import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentLogin from '../pages/student/StudentLogin';
import StudentRegister from '../pages/student/StudentRegister';
import StudentHome from '../pages/student/StudentHome';
import StudentProfileSection from '../pages/student/StudentProfileSection';
import StudentProfileEditsection from '../pages/student/StudentProfileEditSection';
import StudentPasswordEditSection from '../pages/student/StudentPasswordEditSection';

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<StudentLogin/>} />
      <Route path="register" element={<StudentRegister/>} />
      <Route path="home" element={<StudentHome /> }/>

       <Route path="/ProfileSection" element={<StudentProfileSection />} />
        <Route path="/ProfileEditSection" element={<StudentProfileEditsection/>} />
        <Route path="/PasswordEditSection" element={<StudentPasswordEditSection/>} />

   </Routes>
  );
};

export default StudentRoutes;