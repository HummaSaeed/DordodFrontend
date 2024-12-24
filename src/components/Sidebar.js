import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaUser, 
  FaBriefcase, 
  FaGlobe, 
  FaFileAlt, 
  FaBullseye, 
  FaBook, 
  FaChartBar, 
  FaCalendarAlt,
  FaCog
} from "react-icons/fa";
import { theme } from "../theme";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
    { label: "Personal Information", icon: <FaUser />, path: "/dashboard/personal-information" },
    { label: "Professional Info", icon: <FaBriefcase />, path: "/dashboard/professional-information" },
    { label: "Global Information", icon: <FaGlobe />, path: "/dashboard/global-information" },
    { label: "Documents", icon: <FaFileAlt />, path: "/dashboard/documents" },
    { label: "Goals", icon: <FaBullseye />, path: "/dashboard/goals" },
    { label: "Courses", icon: <FaBook />, path: "/dashboard/courses" },
    { label: "SWOT Analysis", icon: <FaChartBar />, path: "/dashboard/swot" },
    { label: "Daily Tracker", icon: <FaCalendarAlt />, path: "/dashboard/habits" },
    { label: "Settings", icon: <FaCog />, path: "/dashboard/settings" }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div style={{
      width: isOpen ? "250px" : "0",
      position: "fixed",
      top: theme.spacing.navbar,
      left: "0",
      bottom: "0",
      backgroundColor: theme.colors.background,
      boxShadow: theme.shadows.sm,
      overflowY: "auto",
      transition: "width 0.3s ease",
      zIndex: 1000,
    }}>
      <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={index}>
              <div
                onClick={() => handleNavigation(item.path)}
                style={{
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: isActive ? theme.colors.primary : theme.colors.text.primary,
                  backgroundColor: isActive ? `${theme.colors.primary}10` : 'transparent',
                  borderLeft: isActive ? `4px solid ${theme.colors.primary}` : '4px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ 
                  fontSize: '1.2rem', 
                  color: isActive ? theme.colors.primary : theme.colors.text.secondary 
                }}>
                  {item.icon}
                </span>
                <span style={{ 
                  marginLeft: "12px",
                  fontWeight: isActive ? '600' : '400'
                }}>
                  {item.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
