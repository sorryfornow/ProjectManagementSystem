
// export default App;
// App.js
import React, { useState,useCallback } from "react";
import CompanyDashboard from "./Users/CompanyDashboard";
import ProfessionalDashboard from "./Users/ProfessionalPage";
//import AdminPage from "./Users/AdminPage";
import LoginPage from "./Users/LoginPage";
import SignUp from "./Users/SignUp";
import AdminPage from "./Users/AdminPage";
import ProjectPage from "./Users/ProjectPage";

import { BrowserRouter as Router, Route, Link, Routes, Navigate } from "react-router-dom";
import UserProfile from "./Users/UserProfile";
import AdminUpdateProject from "./Users/AdminUpdateProject";

function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<SignUp />} />
          {/* <Route path="/dashboard" element={<ProfilePage />} /> */}
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/companydashboard" element={<CompanyDashboard />} />
          {/* <Route path="/companydashboard/:email" element={<CompanyDashboard />} /> */}
          <Route path="/professionaldashboard" element={<ProfessionalDashboard />} />
          <Route path="/professionaldashboard/:email" element={<ProfessionalDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/companyuser_profile/:userName" element={<UserProfile />} />
          <Route path="/prof_profile/:userName" element={<UserProfile />} />
          <Route path="/admin/updateproject/:projectId" element={<AdminUpdateProject />} />
        </Routes>
    </Router>
    </>
  );
}

export default App;

