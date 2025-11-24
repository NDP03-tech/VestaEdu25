import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = ({ isLoggedIn }) => {
  const role = localStorage.getItem('role');
  if (!isLoggedIn || role !== 'user') {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default UserRoute;
