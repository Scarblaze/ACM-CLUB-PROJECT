import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ClubLogin from '../pages/club/ClubLogin';
import ClubRegister from '../pages/club/ClubRegister';
import ClubHome from '../pages/club/ClubHome';

const ClubRoutes = () => {
  return (
    <Routes>
        <Route path="login" element={<ClubLogin />} />
        <Route path="register" element={<ClubRegister />} />
        <Route path="home" element={<ClubHome /> }/>
    </Routes>
  );
};

export default ClubRoutes;