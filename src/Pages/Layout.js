import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CustomNavbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { theme } from '../theme';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Don't render navbar and sidebar on login/registration pages
  if (location.pathname === '/' || location.pathname === '/registration') {
    return <Outlet />;
  }

  return (
    <div>
      <CustomNavbar toggleSidebar={toggleSidebar} />
      <div style={{ display: "flex", marginTop: theme.spacing.navbar }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          style={{
            flex: 1,
            marginLeft: isSidebarOpen ? "250px" : "0",
            padding: "20px",
            transition: "margin-left 0.3s ease",
            overflowY: "auto",
            height: `calc(100vh - ${theme.spacing.navbar})`,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
