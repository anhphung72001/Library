import React from "react";
import Header from "../page/Header";
import SideBar from "../page/SideBar";
import { Navigate } from "react-router-dom";
import STORAGE, { getStorage } from "../lib/storage";

const isAuthenticated = () => {
  return getStorage(STORAGE.USER_INFO) !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? (
    <div>
      <Header />
      <SideBar>{children}</SideBar>
    </div>
  ) : (
    <Navigate to="/403" />
  );
};

export default PrivateRoute;
