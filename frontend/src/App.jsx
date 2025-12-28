import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentRoutes from './routes/StudentRoutes';
import NotFound from './pages/NotFound';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ClubRoutes from './routes/ClubRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';    
const App = () => {
  return (
    <Router>
         <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/club/*" element={<ClubRoutes/>} />
        <Route path="/admin" element={<AdminDashboard />}/>

         <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;