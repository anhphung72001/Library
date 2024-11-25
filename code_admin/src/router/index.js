import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Error403 from '../page/Error403';
import Error404 from '../page/Error404';
import UserManager from '../page/UserManager';
import BookManager from '../page/BookManager';
import BorrowsManager from '../page/BorrowsManager';
import HomePage from '../page/HomePage';
import LoginPage from '../page/LoginPage';
import PrivateRoute from './PrivateRouter';
import AccountManager from '../page/AccountManager';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/user-manager" element={<PrivateRoute><UserManager /></PrivateRoute>} />
      <Route path="/book-manager" element={<PrivateRoute><BookManager /></PrivateRoute>} />
      <Route path="/borrows-manager" element={<PrivateRoute><BorrowsManager /></PrivateRoute>} />
      <Route path="/account-manager" element={<PrivateRoute><AccountManager /></PrivateRoute>} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/login" element={<PrivateRoute><LoginPage /></PrivateRoute>} />
      <Route path="/403" element={<Error403 />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRouter;
